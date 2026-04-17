import sys
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms, models
from PIL import Image

# ==============================
# DEVICE
# ==============================
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ==============================
# CLASS NAMES (MATCH TRAINING)
# ==============================
class_names = ['Fake', 'Real']   # adjust if needed

# ==============================
# IMAGE TRANSFORM (SAME AS TEST)
# ==============================
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])

# ==============================
# LOAD MODEL ARCHITECTURE
# ==============================
model = models.efficientnet_b0(weights=None)

num_ftrs = model.classifier[1].in_features

model.classifier = nn.Sequential(
    nn.Dropout(0.4),
    nn.Linear(num_ftrs, 256),
    nn.ReLU(),
    nn.Dropout(0.3),
    nn.Linear(256, 2)
)

# ==============================
# LOAD WEIGHTS
# ==============================
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "deepfake_detector_efficientnetb0.pth")

model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model = model.to(device)
model.eval()

# ==============================
# PREDICTION FUNCTION
# ==============================
# def predict(img_path):
#     img = Image.open(img_path).convert("RGB")
#     img = transform(img).unsqueeze(0).to(device)

#     with torch.no_grad():
#         outputs = model(img)
#         probs = F.softmax(outputs, dim=1)
#         conf, pred = torch.max(probs, 1)

#     label = class_names[pred.item()]
#     confidence = conf.item()

#     return label, confidence

# # ==============================
# # MAIN (CLI)
# # ==============================
# if __name__ == "__main__":
#     if len(sys.argv) < 2:
#         print("ERROR: No image path provided")
#         sys.exit(1)

#     image_path = sys.argv[1]

#     try:
#         label, confidence = predict(image_path)
#         print(f"{label.upper()} {confidence:.4f}")
#     except Exception as e:
#         print("ERROR:", str(e))
#         sys.exit(1)

def predict(img_path):
    img = Image.open(img_path).convert("RGB")
    img = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(img)
        probs = F.softmax(outputs, dim=1)
        conf, pred = torch.max(probs, 1)

    label = class_names[pred.item()]
    confidence = conf.item() * 100
    print(f"{label.upper()} {confidence:.2f}%")

if __name__ == "__main__":
    predict(sys.argv[1])