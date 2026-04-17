# ==========================================
# DeepFake Image Detection using MobileNetV2
# Optimized Full Code (Fast + Accurate)
# ==========================================

# ========= IMPORT LIBRARIES =========
import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F

from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

import matplotlib.pyplot as plt
from tqdm.auto import tqdm
from PIL import Image
import os

from torchvision.models import MobileNet_V2_Weights


# ========= DEVICE =========
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using Device:", device)

# ========= DATA PREPROCESSING =========
transform = transforms.Compose([
    transforms.Resize((160, 160)),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])

# ========= DATASET PATH =========
data_dir = r"D:\Dharma\DeepFake_Image_Detection\Dataset"

train_path = os.path.join(data_dir, "Train")
valid_path = os.path.join(data_dir, "Validation")
test_path  = os.path.join(data_dir, "Test")

# ========= LOAD DATASETS =========
# train_ds = datasets.ImageFolder(train_path, transform=transform)
# valid_ds = datasets.ImageFolder(valid_path, transform=transform)
# test_ds  = datasets.ImageFolder(test_path, transform=transform)

full_train_ds = datasets.ImageFolder(train_path, transform=transform)
full_valid_ds = datasets.ImageFolder(valid_path, transform=transform)
full_test_ds  = datasets.ImageFolder(test_path, transform=transform)

# from torch.utils.data import Subset
# import random

# train_indices = random.sample(range(len(train_ds)), 30000)
# valid_indices = random.sample(range(len(valid_ds)), 8000)
# test_indices  = random.sample(range(len(test_ds)), 3000)

# train_ds = Subset(train_ds, train_indices)
# valid_ds = Subset(valid_ds, valid_indices)
# test_ds  = Subset(test_ds, test_indices)

from torch.utils.data import Subset
import random

train_indices = random.sample(range(len(full_train_ds)), 30000)
valid_indices = random.sample(range(len(full_valid_ds)), 8000)
test_indices  = random.sample(range(len(full_test_ds)), 3000)

train_ds = Subset(full_train_ds, train_indices)
valid_ds = Subset(full_valid_ds, valid_indices)
test_ds  = Subset(full_test_ds, test_indices)

# ========= DATALOADERS =========
train_loader = DataLoader(
    train_ds,
    batch_size=512,
    shuffle=True,
    num_workers=0,
    pin_memory=True
)

valid_loader = DataLoader(
    valid_ds,
    batch_size=512,
    shuffle=False,
    num_workers=0,
    pin_memory=True
)

test_loader = DataLoader(
    test_ds,
    batch_size=512,
    shuffle=False,
    num_workers=0,
    pin_memory=True
)

# ========= DATA INFO =========
print("Train Images:", len(train_ds))
print("Validation Images:", len(valid_ds))
print("Test Images:", len(test_ds))

# class_names = train_ds.classes
class_names = full_train_ds.classes
print("Classes:", class_names)

# ==========================================
# MODEL : MobileNetV2
# ==========================================
# model = models.mobilenet_v2(pretrained=True)
model = models.mobilenet_v2(weights=MobileNet_V2_Weights.DEFAULT)

# Freeze feature extractor
for param in model.features.parameters():
    param.requires_grad = False

# Replace classifier
num_ftrs = model.classifier[1].in_features

model.classifier = nn.Sequential(
    nn.Dropout(0.4),
    nn.Linear(num_ftrs, 256),
    nn.ReLU(),
    nn.Dropout(0.3),
    nn.Linear(256, 2),
    nn.LogSoftmax(dim=1)
)

model = model.to(device)

# ==========================================
# LOSS + OPTIMIZER
# ==========================================
# criterion = nn.NLLLoss()
# optimizer = optim.Adam(model.classifier.parameters(), lr=0.001)
criterion = nn.NLLLoss()
optimizer = optim.Adam(model.classifier.parameters(), lr=0.001)
# scaler = torch.cuda.amp.GradScaler("cuda")
scaler = torch.amp.GradScaler("cuda")

# ==========================================
# HISTORY
# ==========================================
history = {
    'train_loss': [],
    'val_loss': [],
    'train_acc': [],
    'val_acc': []
}

# ==========================================
# TRAIN FUNCTION
# ==========================================
def run_epoch(epoch, total_epochs):

    # ----- TRAINING -----
    model.train()

    train_loss = 0
    train_correct = 0

    train_bar = tqdm(train_loader, desc=f"Epoch {epoch+1}/{total_epochs} TRAIN")

    for images, labels in train_bar:

        images = images.to(device)
        labels = labels.to(device)
        optimizer.zero_grad()

        # with torch.cuda.amp.autocast("cuda"):
        with torch.amp.autocast("cuda"):
            outputs = model(images)
            loss = criterion(outputs, labels)

        scaler.scale(loss).backward()
        scaler.step(optimizer)
        scaler.update()
        # optimizer.zero_grad()

        # outputs = model(images)
        # loss = criterion(outputs, labels)

        # loss.backward()
        # optimizer.step()

        train_loss += loss.item() * images.size(0)

        _, preds = torch.max(outputs, 1)
        train_correct += torch.sum(preds == labels)

        train_bar.set_postfix(loss=loss.item())

    # ----- VALIDATION -----
    model.eval()

    val_loss = 0
    val_correct = 0

    val_bar = tqdm(valid_loader, desc=f"Epoch {epoch+1}/{total_epochs} VALID")

    with torch.no_grad():

        for images, labels in val_bar:

            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)
            loss = criterion(outputs, labels)

            val_loss += loss.item() * images.size(0)

            _, preds = torch.max(outputs, 1)
            val_correct += torch.sum(preds == labels)

    # ----- FINAL METRICS -----
    train_epoch_loss = train_loss / len(train_ds)
    val_epoch_loss = val_loss / len(valid_ds)

    train_acc = train_correct.double() / len(train_ds)
    val_acc = val_correct.double() / len(valid_ds)

    history['train_loss'].append(train_epoch_loss)
    history['val_loss'].append(val_epoch_loss)
    history['train_acc'].append(train_acc.item())
    history['val_acc'].append(val_acc.item())

    print("\nEpoch Finished")
    print("Train Accuracy:", round(train_acc.item()*100, 2), "%")
    print("Val Accuracy:", round(val_acc.item()*100, 2), "%")
    print("Val Loss:", round(val_epoch_loss, 4))
    print("-"*50)

# ==========================================
# START TRAINING
# ==========================================
epochs = 3

print("\nStarting Training...\n")

for epoch in range(epochs):
    run_epoch(epoch, epochs)

# ==========================================
# TEST ACCURACY
# ==========================================
def evaluate_test():

    model.eval()

    correct = 0
    total = 0

    with torch.no_grad():

        for images, labels in tqdm(test_loader, desc="Testing"):

            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)

            _, preds = torch.max(outputs, 1)

            correct += torch.sum(preds == labels)
            total += labels.size(0)

    acc = correct.double() / total

    print("\nTest Accuracy:", round(acc.item()*100, 2), "%")

evaluate_test()

# ==========================================
# GRAPH
# ==========================================
plt.figure(figsize=(12,5))

# Accuracy
plt.subplot(1,2,1)
plt.plot(history['train_acc'], label='Train Acc')
plt.plot(history['val_acc'], label='Val Acc')
plt.title("Accuracy")
plt.xlabel("Epoch")
plt.ylabel("Accuracy")
plt.legend()

# Loss
plt.subplot(1,2,2)
plt.plot(history['train_loss'], label='Train Loss')
plt.plot(history['val_loss'], label='Val Loss')
plt.title("Loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.legend()

plt.tight_layout()
plt.show()

# ==========================================
# PREDICT SINGLE IMAGE
# ==========================================
def predict_image(image_path):

    model.eval()

    img = Image.open(image_path).convert("RGB")

    img_tensor = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(img_tensor)

        probs = F.softmax(output, dim=1)

        conf, pred = torch.max(probs, 1)

    label = class_names[pred.item()]
    confidence = conf.item() * 100

    print("Prediction:", label)
    print("Confidence:", round(confidence,2), "%")

    plt.imshow(img)
    plt.title(f"{label} ({confidence:.2f}%)")
    plt.axis("off")
    plt.show()

# Example:
# predict_image(r"D:\test.jpg")

# ==========================================
# SAVE MODEL
# ==========================================
torch.save(model.state_dict(), "deepfake_detector_mobilenetv2.pth")

print("\nModel Saved Successfully!")