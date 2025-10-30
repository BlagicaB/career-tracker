# Design Guidelines: Career & Job Tracker

## Design Approach

**System Selection**: Linear-inspired productivity aesthetic with Material Design principles for data-dense interfaces

**Rationale**: This is a utility-focused productivity tool requiring efficient data management, clear information hierarchy, and frequent daily use. Linear's clean, modern approach to project management combined with Material Design's robust component library provides the perfect foundation for this career tracking application.

**Core Principles**:
- Information clarity over visual decoration
- Efficient workflows with minimal clicks
- Consistent data presentation across modules
- Quick navigation between tracker sections
- Scannable layouts for rapid information retrieval

## Typography System

**Font Families**:
- Primary: Inter (via Google Fonts) - UI elements, data tables, navigation
- Secondary: JetBrains Mono - numerical data, dates, status badges

**Hierarchy**:
- Page Titles: text-3xl font-semibold (30px)
- Section Headers: text-xl font-semibold (20px)
- Card Titles: text-base font-medium (16px)
- Body Text: text-sm font-normal (14px)
- Table Headers: text-xs font-semibold uppercase tracking-wide (12px)
- Labels/Metadata: text-xs font-medium (12px)
- Numerical Data: text-sm font-mono (14px, monospace)

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, and 16 for consistent rhythm
- Component padding: p-4, p-6, p-8
- Section gaps: gap-4, gap-6, gap-8
- Card spacing: space-y-4, space-y-6
- Margins: m-2, m-4, m-6

**Grid Structure**:
- Application Layout: Fixed sidebar (w-64) + main content area (flex-1)
- Dashboard Metrics: 4-column grid on desktop (grid-cols-4), 2-column on tablet (md:grid-cols-2), stacked on mobile
- Content Cards: max-w-7xl container with responsive guttering
- Data Tables: Full-width with horizontal scroll on mobile

**Container Hierarchy**:
- App Shell: Full viewport height (h-screen) with flex layout
- Main Content: Scrollable area with py-8 px-6 consistent padding
- Cards/Modules: Rounded corners (rounded-lg), consistent elevation with borders

## Navigation & Shell

**Sidebar Navigation**:
- Fixed left sidebar with module icons + labels
- Active state: Distinct visual treatment with indicator
- Modules: Dashboard, Job Applications, Networking, Skills, Goals, Resumes
- Width: 256px (w-64) on desktop, collapsible drawer on mobile
- Logo/branding at top (h-16 flex items-center)
- Navigation items: py-2 px-4 with hover states

**Top Bar**:
- Height: h-16 with border-bottom separator
- Contains: Current module title, search bar, user profile menu
- Search: Prominent positioning (w-96) with keyboard shortcut hint
- User menu: Far right with avatar + dropdown

## Component Library

### Dashboard Metrics Cards
- Grid layout with 4 equal-width cards
- Each card: p-6 with border, rounded-lg
- Structure: Label (text-xs uppercase), Large number (text-3xl font-bold), Trend indicator (with icon)
- Minimum height: h-32 for consistency

### Data Tables
- Compact design with text-sm throughout
- Header row: Sticky positioning (sticky top-0), uppercase labels, border-bottom-2
- Data rows: py-3 px-4, hover state for interactivity, border-bottom
- Cell alignment: Text left, numbers right, dates center
- Action column: Right-aligned with icon buttons
- Empty states: Centered message with illustration placeholder
- Pagination: Bottom-right corner with page numbers + navigation

### Forms & Input Fields
- Input fields: h-10 with rounded-md, px-3 py-2
- Labels: text-sm font-medium, mb-2
- Help text: text-xs, mt-1
- Field groups: space-y-4 for vertical stacking
- Multi-column forms: grid grid-cols-2 gap-6 on desktop
- Required indicators: Asterisk after label
- Validation: Inline error messages (text-xs) below fields

### Status Badges
- Compact design: px-3 py-1, rounded-full, text-xs font-medium
- States: Applied, Interviewing, Offer, Rejected, Active, Inactive, etc.
- Monospace font for consistent width

### Action Buttons
- Primary: px-4 py-2, rounded-md, font-medium
- Secondary: Similar sizing with border variant
- Icon buttons: w-8 h-8, rounded, centered icon
- Button groups: space-x-2 for horizontal layouts

### Cards & Panels
- Standard card: p-6, rounded-lg, border
- Header section: pb-4, border-bottom, contains title + actions
- Content section: pt-4 with structured content
- Footer section: pt-4, border-top for actions/metadata

### Modals & Dialogs
- Overlay: Semi-transparent backdrop
- Modal: max-w-2xl, rounded-lg, max-h-screen overflow management
- Header: p-6, border-bottom with title + close button
- Body: p-6 with scrollable content
- Footer: p-6, border-top with action buttons (right-aligned)

### Contact/Network Cards
- Compact list view: Avatar (w-10 h-10 rounded-full), Name/title, Company, Quick actions
- Detailed view: Expanded layout with full contact info grid
- Notes section: Separate panel with textarea

### Skills Visualization
- Skill items: Flex layout with skill name + proficiency indicator
- Proficiency: Visual bar (h-2 rounded-full) showing skill level
- Categories: Grouped sections with category headers
- Grid layout: 2-column on desktop (grid-cols-2 gap-6)

## Page-Specific Layouts

**Dashboard Overview**:
- Metrics grid at top (4 columns)
- Below: 2-column layout with recent applications (left) + upcoming follow-ups (right)
- Quick stats: Compact cards showing application pipeline visualization

**Job Applications**:
- Toolbar: Filters (status, priority, date range) + search + "Add Application" button
- Table view: All application columns with sortable headers
- Detail panel: Slides in from right when row is clicked

**Networking CRM**:
- Card grid view default (3 columns on desktop)
- Alternative: Compact list view toggle
- Quick filters by company, status, last contact date
- Detail modal for full contact management

**Skills Dashboard**:
- Categorized sections (Technical, Soft Skills, Tools, Languages)
- Visual proficiency bars for each skill
- Add/edit inline controls

**Goals Tracker**:
- Timeline view for goal progression
- Individual goal cards with progress bars
- Milestones as checkpoints

**Resume Vault**:
- File upload dropzone at top (h-48, dashed border)
- Grid of resume cards (3 columns) with thumbnail, title, date, actions
- Download/preview/delete actions per resume

## Responsive Behavior

**Desktop (lg: 1024px+)**: Full layout with sidebar visible, multi-column grids
**Tablet (md: 768px)**: Collapsible sidebar, 2-column grids, maintained table layouts
**Mobile (base: <768px)**: Drawer navigation, single-column layouts, horizontal scroll for tables, stacked forms

## Micro-Interactions

**Minimal Animation Budget**:
- Hover states: Subtle opacity/background changes (transition-colors)
- Focus states: Clear outline for keyboard navigation
- Loading states: Simple spinner, no skeleton screens
- Transitions: 150ms duration for UI feedback only

## Icons

**Library**: Heroicons (via CDN)
**Usage**: 
- Navigation: 20px icons
- Table actions: 16px icons
- Status indicators: 12px icons
- Buttons: 16px icons with 8px gap to text