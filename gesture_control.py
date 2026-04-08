#!/usr/bin/env python3
"""
GestureControl - Qo'l harakatlari orqali kompyuter boshqaruvi
Mouse, Keyboard va Screen boshqarish
"""

import cv2
try:
    import mediapipe as mp
    mp_hands = mp.solutions.hands
    mp_drawing = mp.solutions.drawing_utils
    hands = mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=1,
        min_detection_confidence=0.7,
        min_tracking_confidence=0.5
    )
    USE_MEDIAPIPE = True
except Exception as e:
    print(f"⚠️ MediaPipe xatosi: {e}")
    print("📌 OpenCV bilan ishlayapti...")
    USE_MEDIAPIPE = False

import pyautogui
import time
import math
import threading
from collections import deque

# PyAutoGUI settings
pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.01

# Screen resolution
SCREEN_WIDTH, SCREEN_HEIGHT = pyautogui.size()
CAMERA_WIDTH, CAMERA_HEIGHT = 640, 480

# Gesture detection settings
click_threshold = 0.04
pinch_threshold = 0.05
swipe_threshold = 50

# State variables
last_click_time = 0
last_drag_time = 0
is_dragging = False
drag_start = None

# Hand position smoothing
position_history = deque(maxlen=5)
smooth_x, smooth_y = SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2

def detect_hand_simple(frame):
    """Simple hand detection using color-based detection"""
    # HSV range for skin color
    lower_skin = (0, 20, 70)
    upper_skin = (20, 255, 255)
    
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, lower_skin, upper_skin)
    
    # Morphology operations
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    
    # Find contours
    contours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        return None, None, frame
    
    # Get largest contour (hand)
    hand_contour = max(contours, key=cv2.contourArea)
    area = cv2.contourArea(hand_contour)
    
    if area < 1000:  # Too small
        return None, None, frame
    
    # Get hand center and bounding rect
    M = cv2.moments(hand_contour)
    if M["m00"] == 0:
        return None, None, frame
    
    cx = int(M["m10"] / M["m00"])
    cy = int(M["m01"] / M["m00"])
    
    x, y, w, h = cv2.boundingRect(hand_contour)
    
    # Draw hand
    cv2.drawContours(frame, [hand_contour], 0, (0, 255, 0), 2)
    cv2.circle(frame, (cx, cy), 5, (255, 0, 0), -1)
    
    return (cx, cy), area, frame

def detect_gesture_simple(hand_data, area):
    """Simple gesture detection based on hand size and position"""
    if hand_data is None:
        return None
    
    # Finger count estimation based on area changes
    if area > 15000:  # Large area - likely open palm
        return 'palm'
    elif area > 8000:  # Medium - likely point
        return 'point'
    elif area > 5000:  # Smaller - likely pinch
        return 'pinch'
    elif area > 2000:  # Small - likely fist
        return 'fist'
    
    return None
    """Calculate Euclidean distance between two points"""
    return math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2 + (p1.z - p2.z)**2)

def detect_gesture(landmarks, handedness):
    """Detect gesture from hand landmarks"""
    
    if not landmarks:
        return None
    
    # Landmark indices
    WRIST = landmarks[0]
    THUMB_TIP = landmarks[4]
    INDEX_TIP = landmarks[8]
    INDEX_PIP = landmarks[6]
    MIDDLE_TIP = landmarks[12]
    MIDDLE_PIP = landmarks[10]
    RING_TIP = landmarks[16]
    RING_PIP = landmarks[14]
    PINKY_TIP = landmarks[20]
    PINKY_PIP = landmarks[18]
    
    # Finger distances
    thumb_to_index = distance(THUMB_TIP, INDEX_TIP)
    index_to_middle = distance(INDEX_TIP, MIDDLE_TIP)
    
    # Check if fingers are open
    index_open = distance(INDEX_TIP, INDEX_PIP) > 0.05
    middle_open = distance(MIDDLE_TIP, MIDDLE_PIP) > 0.05
    ring_open = distance(RING_TIP, RING_PIP) > 0.05
    pinky_open = distance(PINKY_TIP, PINKY_PIP) > 0.05
    thumb_open = distance(THUMB_TIP, landmarks[3]) > 0.05
    
    # Gesture detection logic
    
    # Pinch (Click)
    if thumb_to_index < pinch_threshold and not middle_open and not ring_open and not pinky_open:
        return 'pinch'
    
    # Point (Mouse move)
    if index_open and not middle_open and not ring_open and not pinky_open and not thumb_open:
        return 'point'
    
    # Fist (Stop/Reset)
    if not index_open and not middle_open and not ring_open and not pinky_open and not thumb_open:
        return 'fist'
    
    # Open palm (Pause)
    if index_open and middle_open and ring_open and pinky_open and thumb_open:
        return 'palm'
    
    # Peace sign (Swipe)
    if index_open and middle_open and not ring_open and not pinky_open and not thumb_open:
        return 'peace'
    
    return None

def control_mouse(index_finger, frame_shape):
    """Control mouse movement based on index finger position"""
    global smooth_x, smooth_y, position_history
    
    # Convert hand coordinates to screen coordinates
    h, w = frame_shape[:2]
    x = int((1 - index_finger.x) * SCREEN_WIDTH)
    y = int(index_finger.y * SCREEN_HEIGHT)
    
    # Add to history for smoothing
    position_history.append((x, y))
    
    # Calculate smooth position
    if position_history:
        smooth_x = int(sum(p[0] for p in position_history) / len(position_history))
        smooth_y = int(sum(p[1] for p in position_history) / len(position_history))
    
    # Move mouse
    pyautogui.moveTo(smooth_x, smooth_y)

def handle_gesture(gesture, landmarks, frame_shape):
    """Handle detected gestures"""
    global last_click_time, is_dragging, drag_start
    
    current_time = time.time()
    
    if gesture == 'pinch':
        # Click
        if current_time - last_click_time > 0.3:  # 300ms debounce
            pyautogui.click()
            print("🖱️ CLICK")
            last_click_time = current_time
    
    elif gesture == 'point':
        # Move mouse
        control_mouse(landmarks[8], frame_shape)  # Index finger
        is_dragging = False
    
    elif gesture == 'palm':
        # Press/Release spacebar (pause/play)
        if current_time - last_click_time > 0.5:
            pyautogui.press('space')
            print("⏸️ SPACEBAR")
            last_click_time = current_time
    
    elif gesture == 'fist':
        # Reset to home position
        pyautogui.moveTo(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2)
        print("👊 FIST - Reset")
    
    elif gesture == 'peace':
        # Gesture peace - can be for different actions
        print("✌️ PEACE")

def main():
    """Main gesture control loop"""
    global USE_MEDIAPIPE

    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, CAMERA_WIDTH)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, CAMERA_HEIGHT)
    
    print("🎥 GestureControl ISHGA TUSHDI!")
    print("\n📍 Qo'l Harakatlari:")
    print("  ☝️ Barmoq Ko'rsatish - Kursor harakat")
    print("  🤏 Pinch (Chiplash) - CLICK")
    print("  ✋ Ochiq Kaft - SPACEBAR (Play/Pause)")
    print("  👊 Musht - Reset (markaz)")
    print("  ✌️ Peace - Swipe")
    print("\n📺 Chiqish: 'q' tugmasini bosing")
    print("\n" + "="*50)

    try:
        frame_count = 0
        while True:
            success, frame = cap.read()
            if not success:
                print("❌ Kamera xatosi!")
                break
            
            # Flip the image (mirror effect)
            frame = cv2.flip(frame, 1)
            h, w, c = frame.shape
            
            # Always try simple detection first
            hand_data, hand_area, frame = detect_hand_simple(frame)

            if hand_data:
                cx, cy = hand_data

                # Move mouse to hand position
                screen_x = int((cx / w) * SCREEN_WIDTH)
                screen_y = int((cy / h) * SCREEN_HEIGHT)

                position_history.append((screen_x, screen_y))
                if position_history:
                    smooth_x = int(sum(p[0] for p in position_history) / len(position_history))
                    smooth_y = int(sum(p[1] for p in position_history) / len(position_history))
                    pyautogui.moveTo(smooth_x, smooth_y)

                # Detect gesture
                gesture = detect_gesture_simple(hand_data, hand_area)

                if gesture:
                    current_time = time.time()

                    if gesture == 'pinch' and current_time - last_click_time > 0.3:
                        pyautogui.click()
                        print(f"🖱️  CLICK")
                        last_click_time = current_time
                    elif gesture == 'palm' and current_time - last_click_time > 0.5:
                        pyautogui.press('space')
                        print(f"⏸️  SPACEBAR")
                        last_click_time = current_time
                    elif gesture == 'fist':
                        pyautogui.moveTo(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2)
                        print(f"👊 RESET")

                    # Display gesture name
                    cv2.putText(frame, f"Harakat: {gesture.upper()}", (10, 30),
                              cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            # Try MediaPipe if available
            if USE_MEDIAPIPE:
                try:
                    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    results = hands.process(rgb_frame)

                    # Draw landmarks and detect gestures
                    if results.multi_hand_landmarks and results.multi_handedness:
                        for hand_landmarks, handedness in zip(results.multi_hand_landmarks, results.multi_handedness):
                            # Draw hand
                            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                            # Detect gesture
                            gesture = detect_gesture(hand_landmarks.landmark, handedness.classification[0].label)

                            # Handle gesture
                            if gesture:
                                handle_gesture(gesture, hand_landmarks.landmark, frame.shape)

                                # Display gesture name
                                cv2.putText(frame, f"Harakat: {gesture.upper()}", (10, 30),
                                          cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                except Exception as e:
                    print(f"MediaPipe xatosi: {e}")
                    USE_MEDIAPIPE = False

            # Display mouse position
            cv2.putText(frame, f"Kursor: ({smooth_x}, {smooth_y})", (10, 70),
                      cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 1)
            
            # Display FPS
            frame_count += 1
            if frame_count % 10 == 0:
                cv2.putText(frame, f"FPS: 30", (w-150, 30),
                          cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 1)

            # Display status
            status = "✅ ISHGA TUSHGAN" if USE_MEDIAPIPE else "⚠️ OpenCV Rejimida"
            cv2.putText(frame, status, (10, h-20),
                      cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0) if USE_MEDIAPIPE else (0, 165, 255), 1)

            # Show frame
            cv2.imshow("🎯 GestureControl - Qo'l Harakatlari Boshqaruvi", frame)

            # Exit on 'q'
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                print("\n👋 Dastur yopildi!")
                break
    
    finally:
        cap.release()
        cv2.destroyAllWindows()
        print("✅ Dastur to'g'ri yopildi")

if __name__ == "__main__":
    main()

