# Mobile App Design Prompt for Momentum Habit Tracker

## Overview

Design a modern, motivational mobile app for **Momentum** - a comprehensive habit tracking application that helps users build and maintain positive habits through streaks, analytics, and personalized insights.

## App Purpose

Momentum is a habit tracking app that empowers users to:

- Create and manage daily, interval-based, or custom-scheduled habits
- Track habit completion and build streaks
- Visualize progress through detailed analytics
- Receive personalized insights about their strongest/weakest habits
- Get motivated through consistency scores and trend analysis

## Target Audience

- Young professionals (25-40 years old) seeking self-improvement
- Productivity enthusiasts who want data-driven insights
- People building new routines or breaking bad habits
- Users who are motivated by visual progress and gamification

## Design Aesthetic

- **Modern & Motivational**: Clean, inspiring design that encourages daily engagement
- **Data-Driven**: Beautiful charts and visualizations that make analytics engaging
- **Gamified**: Streak counters, progress bars, and achievement-style elements
- **Premium Feel**: Sophisticated color palette with smooth animations
- **Minimalist**: Focus on content, avoid clutter
- **Dark Mode Friendly**: Consider both light and dark themes

## Color Palette Suggestions

- **Primary**: Vibrant gradient (e.g., purple to blue, or orange to pink) for motivation
- **Success**: Green tones for completed habits and positive streaks
- **Warning**: Amber/orange for habits at risk
- **Danger**: Red for broken streaks or weakest habits
- **Neutral**: Soft grays for backgrounds, white/dark for cards
- **Accent**: Bright, energetic color for CTAs and highlights

## Core Features & Screens to Design

### 1. Authentication Flow

**Screens:**

- **Welcome/Onboarding** (3-4 slides explaining the app's value)
- **Sign Up** (email, password, confirm password)
- **Sign In** (email, password, "Forgot Password?" link)

**Key Elements:**

- Inspiring hero images or illustrations
- Clear value propositions
- Social proof or motivational quotes
- Smooth transitions between screens

---

### 2. Home/Dashboard Screen

**Purpose:** Daily overview of habits and quick actions

**Key Components:**

- **Header:**
  - Welcome message with user's name
  - Current date
  - Overall streak counter (prominent display)
- **Today's Habits Section:**
  - List of habits scheduled for today
  - Each habit card shows:
    - Habit title and icon/emoji
    - Current streak count
    - Completion checkbox/button (large, satisfying to tap)
    - Frequency indicator (daily/custom days)
  - Visual distinction between completed and pending habits
- **Quick Stats Cards:**
  - Overall success rate (percentage)
  - Total active habits
  - Longest current streak
  - Today's completion rate
- **Motivational Element:**
  - Daily quote or achievement badge
  - Progress ring/circle showing daily completion

**Interactions:**

- Swipe to complete habit (with satisfying animation)
- Tap habit card to view details
- Pull to refresh

---

### 3. Habits Management Screen

**Purpose:** View, create, edit, and delete habits

**Key Components:**

- **All Habits List:**
  - Categorized or filterable view (Active/Archived)
  - Each habit shows:
    - Title and description preview
    - Frequency type (daily/interval/custom)
    - Current streak
    - Completion rate percentage
    - Quick actions (edit, delete, toggle active)
- **Floating Action Button (FAB):**
  - Prominent "+" button to create new habit
- **Empty State:**
  - Friendly illustration when no habits exist
  - Clear CTA to create first habit

**Interactions:**

- Tap to view habit details
- Long press for quick actions menu
- Swipe actions (edit, delete, archive)

---

### 4. Create/Edit Habit Screen

**Purpose:** Form to create or modify a habit

**Form Fields:**

- **Habit Title** (text input, required)
- **Description** (multiline text, optional)
- **Frequency Type** (segmented control or radio buttons):
  - Daily
  - Interval (every X days) - shows number input
  - Custom (specific days) - shows day selector
- **Reminder Times** (time picker, multiple allowed)
  - Add/remove reminder times
- **Active Toggle** (switch)

**Design Considerations:**

- Progressive disclosure (show interval/custom options only when selected)
- Clear visual hierarchy
- Inline validation
- Save/Cancel buttons (sticky footer)
- Confirmation dialog for destructive actions

---

### 5. Habit Detail Screen

**Purpose:** Deep dive into a single habit's performance

**Key Components:**

- **Header:**
  - Habit title and description
  - Edit button
  - Current streak (large, prominent)
- **Analytics Cards:**
  - **Completion Rate:** Circular progress chart with percentage
  - **Risk Score:** Visual indicator (low/medium/high risk of breaking)
  - **Missed Days:** Count with trend indicator
  - **Recovery Rate:** How quickly user bounces back after missing
  - **Habit Age:** Days since creation
- **Completion Calendar:**
  - Monthly calendar view showing completed/missed days
  - Color-coded (green = completed, gray = missed, white = future)
- **Completion History:**
  - Timeline/list of recent completions
  - Timestamps for each completion

**Interactions:**

- Tap calendar day to see details
- Scroll through analytics
- Quick complete button if not done today

---

### 6. Analytics Dashboard

**Purpose:** Comprehensive overview of all habit performance

**Key Components:**

- **Summary Section:**
  - Overall success rate (large percentage)
  - Consistency score (0-100 with visual gauge)
  - Total habits tracked
  - Total days active
- **Streak Summary:**
  - Current longest streak
  - All-time longest streak
  - Average streak length
- **Best & Worst Performers:**
  - Strongest habit (highest completion rate) - highlighted in green
  - Weakest habit (lowest completion rate) - highlighted in amber/red
  - Tap to view habit details
- **Trends Section:**
  - **Weekly Trends:** Line/bar chart showing last 4 weeks
  - **Monthly Trends:** Line/bar chart showing last 6 months
  - Toggle between views
- **Daily Completion Summary:**
  - Heatmap or calendar view
  - Shows completion patterns over time

**Design Considerations:**

- Use charts and graphs (line charts, bar charts, donut charts)
- Color-coded data for quick insights
- Smooth animations when loading data
- Ability to filter by date range
- Export/share functionality

---

### 7. Streaks Screen

**Purpose:** Celebrate and track all streaks

**Key Components:**

- **Overall User Streak:**
  - Large counter showing total consecutive days
  - Fire/flame icon animation
- **Individual Habit Streaks:**
  - List of all habits with their streaks
  - Sorted by longest streak
  - Visual indicators (badges, medals for milestones)
  - Current vs. longest streak comparison
- **Streak Milestones:**
  - Achievements (7 days, 30 days, 100 days, etc.)
  - Progress to next milestone
  - Shareable achievement cards

**Interactions:**

- Tap streak to view habit details
- Share streak achievement on social media
- Celebrate animations when milestones are reached

---

### 8. Profile/Settings Screen

**Purpose:** User account management and app settings

**Key Components:**

- **User Info:**
  - Profile picture (avatar)
  - Name and email
  - Edit profile button
- **Settings Sections:**
  - **Notifications:**
    - Enable/disable reminders
    - Notification sound
    - Quiet hours
  - **Appearance:**
    - Theme selection (light/dark/auto)
    - Color scheme options
  - **Data & Privacy:**
    - Export data
    - Delete account
  - **About:**
    - App version
    - Terms of service
    - Privacy policy
- **Sign Out Button** (prominent, at bottom)

---

## UI Components to Design

### Habit Cards

- Compact card showing habit info
- Completion checkbox (large, tactile)
- Streak counter with flame icon
- Frequency indicator
- Swipe actions reveal

### Charts & Visualizations

- **Line Charts:** For trends over time
- **Bar Charts:** For weekly/monthly comparisons
- **Donut/Circular Progress:** For completion rates
- **Heatmap Calendar:** For completion history
- **Gauge/Meter:** For consistency score

### Buttons & CTAs

- **Primary Button:** Solid, vibrant color for main actions
- **Secondary Button:** Outlined or ghost style
- **FAB:** Floating action button for create actions
- **Icon Buttons:** For quick actions (edit, delete, share)

### Empty States

- Friendly illustrations
- Clear messaging
- Prominent CTA to take action

### Loading States

- Skeleton screens for content loading
- Smooth shimmer effects
- Progress indicators for long operations

### Success Animations

- Confetti or particle effects when completing habits
- Checkmark animations
- Streak milestone celebrations
- Smooth transitions between states

---

## Navigation Structure

### Bottom Tab Navigation (Recommended)

1. **Home/Today** (house icon) - Dashboard with today's habits
2. **Habits** (list icon) - All habits management
3. **Analytics** (chart icon) - Analytics dashboard
4. **Streaks** (flame icon) - Streaks overview
5. **Profile** (user icon) - Settings and profile

**Alternative:** Drawer navigation with same sections

---

## Micro-Interactions & Animations

1. **Habit Completion:**
   - Satisfying checkmark animation
   - Haptic feedback
   - Confetti or particle burst
   - Streak counter increment animation

2. **Streak Milestones:**
   - Badge unlock animation
   - Celebratory modal/toast
   - Shareable achievement card

3. **Loading:**
   - Skeleton screens
   - Smooth fade-ins
   - Pull-to-refresh animation

4. **Transitions:**
   - Smooth screen transitions
   - Card expand/collapse
   - Bottom sheet modals for quick actions

5. **Data Visualization:**
   - Charts animate in on load
   - Interactive tooltips on tap
   - Smooth transitions between time periods

---

## Accessibility Considerations

- High contrast mode support
- Large touch targets (minimum 44x44pt)
- Screen reader support
- Clear labels and descriptions
- Keyboard navigation support
- Adjustable text sizes

---

## Platform-Specific Considerations

### iOS

- Follow Human Interface Guidelines
- Use SF Symbols for icons
- Native iOS components (switches, pickers)
- Swipe gestures for navigation
- Haptic feedback

### Android

- Follow Material Design guidelines
- Use Material icons
- Floating Action Button (FAB)
- Bottom sheets for modals
- Material ripple effects

---

## API Integration Notes

The app will integrate with the following API endpoints:

### Authentication

- `POST /user/auth/signup` - Register new user
- `POST /user/auth/signin` - Sign in user
- `POST /user/auth/signout` - Sign out user
- `GET /user` - Get current user profile

### Habits

- `GET /habits` - Get all user habits
- `GET /habits/:habitId` - Get specific habit
- `POST /habits` - Create new habit
- `PATCH /habits/:habitId` - Update habit
- `DELETE /habits/:habitId` - Delete habit
- `POST /habits/:habitId/completed` - Mark habit as completed
- `GET /habits/:habitId/logs` - Get completion logs

### Streaks

- `GET /streak` - Get overall user streak
- `GET /streak/all` - Get all streaks
- `GET /streak/:habitId` - Get habit-specific streak

### Analytics

- `GET /analytics/summary` - Comprehensive dashboard data
- `GET /analytics/success-rate` - Overall success rate
- `GET /analytics/streaks` - Streak summary
- `GET /analytics/daily` - Daily completion summary
- `GET /analytics/strongest-habit` - Best performing habit
- `GET /analytics/weakest-habit` - Worst performing habit
- `GET /analytics/consistency-score` - Consistency score
- `GET /analytics/trends/weekly` - Last 4 weeks trends
- `GET /analytics/trends/monthly` - Last 6 months trends
- `GET /analytics/habits/:habitId` - Per-habit analytics

---

## Data Models Reference

### Habit Object

```json
{
  "id": "uuid",
  "title": "Morning Exercise",
  "description": "30 minutes of cardio",
  "frequencyType": "daily" | "interval" | "custom",
  "intervalDays": 3, // if interval type
  "customDays": ["monday", "wednesday", "friday"], // if custom type
  "reminderTimes": ["08:00", "20:00"],
  "isActive": true,
  "createdAt": "timestamp"
}
```

### Analytics Summary

```json
{
  "successRate": 85.5,
  "consistencyScore": 78,
  "totalHabits": 5,
  "currentStreak": 12,
  "longestStreak": 45,
  "completedToday": 3,
  "totalToday": 4
}
```

---

## Design Deliverables Requested

Please provide:

1. **High-fidelity mockups** for all screens listed above
2. **User flow diagrams** showing navigation between screens
3. **Component library** with reusable UI elements
4. **Interactive prototype** demonstrating key interactions
5. **Design system** including:
   - Color palette
   - Typography scale
   - Spacing system
   - Icon set
   - Component states (default, hover, active, disabled)
6. **Animation specifications** for key micro-interactions
7. **Responsive layouts** for different screen sizes (if applicable)
8. **Dark mode variants** for all screens

---

## Inspiration & References

**Design Style:**

- Modern, clean, and motivational
- Data-driven with beautiful visualizations
- Gamified elements (streaks, achievements, progress)
- Premium feel with smooth animations

**Similar Apps for Reference:**

- Habitica (gamification)
- Streaks (minimalist design)
- Way of Life (analytics)
- Productive (modern UI)
- Fabulous (motivational design)

**Key Differentiators:**

- Comprehensive analytics dashboard
- Risk scoring for habits
- Recovery rate tracking
- Flexible frequency options (daily/interval/custom)
- Detailed per-habit insights

---

## Success Metrics

The design should optimize for:

1. **Daily engagement** - Make checking off habits satisfying
2. **Habit creation** - Make it easy to add new habits
3. **Data insights** - Make analytics actionable and motivating
4. **Streak maintenance** - Celebrate and encourage consistency
5. **User retention** - Create habit loops that bring users back daily

---

## Additional Notes

- The app uses **session-based authentication** (cookies), so handle session management gracefully
- All API requests require authentication except signup/signin
- Consider **offline mode** for viewing data and marking completions (sync when online)
- Think about **notifications** for habit reminders
- Consider **widgets** for quick habit completion from home screen
- Plan for **onboarding flow** to help new users create their first habits

---

## Questions to Consider

1. Should we include social features (friends, leaderboards)?
2. Do we need habit categories or tags for organization?
3. Should there be preset habit templates for quick setup?
4. Do we want to include notes/journal entries for completions?
5. Should we support habit goals (e.g., "Complete 100 times")?
6. Do we need export functionality for analytics data?

---

Thank you for designing Momentum! The goal is to create an app that not only tracks habits but genuinely motivates users to build better routines through beautiful design, meaningful data, and delightful interactions.
