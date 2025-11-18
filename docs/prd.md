# Candy Crush Game Requirements Document

## 1. Game Overview

### 1.1 Game Name
Candy Crush

### 1.2 Game Description\nA classic match-3 puzzle game where players swap adjacent candies to create matches of three or more identical candies, eliminating them from the board and scoring points.

## 2. Gameplay Mechanics

### 2.1 Core Mechanics
- Players can swap two adjacent candies (horizontally or vertically)
- When three or more candies of the same type align, they are eliminated
- New candies fall from the top to fill empty spaces
- Chain reactions occur when falling candies create new matches

### 2.2 Game Controls
- Click/tap on a candy, then click/tap an adjacent candy to swap positions
- Only valid swaps that create matches are allowed
- Invalid swaps will revert back to original positions

### 2.3 Win/Lose Conditions
- Win: Reach the target score within the limited number of moves
- Lose: Run out of moves before reaching the target score
- Each level has a specific target score and move limit

## 3. Game Features

### 3.1 Candy Types
- 5 different colored candies: red, blue, green, yellow, purple
- Each candy type has a distinct visual appearance
\n### 3.2 Special Candies
- Striped Candy: Created by matching4 candies in a row, clears entire row or column
- Wrapped Candy: Created by matching 5 candies in L or T shape, explodes in3x3 area
- Color Bomb: Created by matching 5 candies in a row, removes all candies of one color
\n### 3.3 Scoring System
- Basic match (3 candies): 100 points
- Extended match (4 candies): 200 points
- Special match (5+ candies): 500 points\n- Chain reaction bonus: multiplier increases with consecutive matches

### 3.4 Level Progression
- Multiple levels with increasing difficulty
- Higher target scores and fewer moves in advanced levels
- Display current level number and progress

## 4. User Interface

### 4.1 Game Board
- 8x8 grid layout for candy placement
- Clear visual feedback for valid/invalid moves
- Smooth animation for candy swaps and eliminations

### 4.2 Information Display
- Current score counter
- Remaining moves counter
- Target score indicator
- Level number display

### 4.3 Game Controls
- Restart button: restart current level
- Pause button: pause game and show menu
- Sound toggle: enable/disable sound effects

## 5. Design Style

### 5.1 Color Scheme
- Vibrant candy colors: bright red (#FF3B3B), sky blue (#4A90E2), lime green (#7ED321), sunny yellow (#F5A623), royal purple (#BD10E0)
- Soft pastel background (#FFF5E6) to make candies stand out
- White UI elements with subtle shadows for clarity

### 5.2 Visual Details
- Rounded candy shapes with glossy gradient effect and white highlight
- Smooth bounce animation when candies fall
- Particle effects when candies are eliminated
- Gentle pulse animation for selected candy
- Celebration animation when level is completed

### 5.3 Layout Style
- Card-based UI with soft shadows for score and moves display
- Centered game board with balanced spacing
- Playful, rounded sans-serif font for numbers and text