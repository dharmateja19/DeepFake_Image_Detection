import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms, models
from PIL import Image
import sys

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class_names = ['Fake', 'Real']

# Transform
transform = transforms.Compose([
    transforms.Resize((160, 160)),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "deepfake_detector_mobilenetv2.pth")

model = models.mobilenet_v2(weights=None)

num_ftrs = model.classifier[1].in_features

model.classifier = nn.Sequential(
    nn.Dropout(0.4),
    nn.Linear(num_ftrs, 256),
    nn.ReLU(),
    nn.Dropout(0.3),
    nn.Linear(256, 2)
)

model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model = model.to(device)
model.eval()

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