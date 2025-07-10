# AccAnalytics - Axcera

A modern, feature-rich customer analytics table built with Next.js, TypeScript, and Ant Design-styled components.

## 🚀 Features

### 📊 **Advanced Table Management**
- **100 Randomized Records** - Realistic customer data for testing
- **Lazy Loading** - Loads 10 records at a time for optimal performance
- **Infinite Scroll** - Automatic loading when scrolling to bottom
- **Column Management** - Drag & drop reordering, show/hide columns
- **Responsive Design** - Works seamlessly on all devices

### 🔍 **Powerful Filtering System**
- **Advanced Search** - Search across multiple fields simultaneously
- **Multi-Platform Filter** - Filter by MetaTrader 4/5, cTrader, DXTrade, TradingView
- **Status Filtering** - Active, Inactive, Pending, Suspended, Closed
- **Category Filter** - Live, Demo, Practice, Paper, Simulation accounts
- **Date Range Picker** - Custom date range filtering
- **Filter Chips** - Visual representation of active filters
- **Saved Filters** - Save and restore filter combinations
- **Quick Clear** - One-click filter clearing

### 🎨 **Ant Design Styling**
- **Professional UI** - Clean, modern Ant Design aesthetic
- **Consistent Colors** - Blue primary (#1890ff) with proper gray scales
- **Hover Effects** - Interactive table rows and buttons
- **Sticky Filter Bar** - Always accessible filtering while scrolling
- **Smooth Animations** - Polished user experience

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **UI Components**: shadcn/ui with Ant Design styling
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns 3.6.0
- **Form Management**: React Hook Form
- **Notifications**: Sonner

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/AccAnalytics-Axcera.git
cd AccAnalytics-Axcera

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚀 Usage

1. **Browse Data**: View customer records with lazy loading
2. **Search**: Use the advanced search bar to find specific customers
3. **Filter**: Apply multiple filters simultaneously
4. **Customize**: Drag columns to reorder, hide unwanted columns
5. **Save Filters**: Create saved filter combinations for quick access

## 📱 Features in Detail

### Column Management
- **Edit Mode**: Click "Edit Columns" to enter management mode
- **Drag & Drop**: Reorder columns by dragging headers
- **Show/Hide**: Add or remove columns via the "Add Column" dropdown
- **Reset**: Return to default column configuration

### Filter System
- **Sticky Header**: Filter bar stays visible while scrolling
- **Real-time**: Filters apply immediately as you type/select
- **Visual Feedback**: Active filters shown as removable chips
- **Persistence**: Filter state saved in localStorage

### Performance
- **Lazy Loading**: Only loads 10 records initially
- **Infinite Scroll**: Automatically loads more when scrolling
- **Optimized Rendering**: Efficient React patterns for smooth scrolling

## 🎯 Data Schema

Each customer record includes:
- **Account Info**: Account number, customer ID, order number
- **Personal Details**: Name, email, phone, address
- **Trading Data**: Balance, equity, platform, status
- **Account Status**: Type, program level, upgrade history
- **Compliance**: Breach reasons, verification status

## 🔧 Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📊 Performance Features

- **Virtual Scrolling**: Handles large datasets efficiently
- **Memoized Components**: Optimized re-rendering
- **Debounced Search** - Reduces API calls during typing
- **Cached Filters** - Quick filter application

## 🎨 Customization

The project uses Ant Design color scheme:
- **Primary Blue**: `#1890ff` and variants
- **Grays**: `#f5f5f5`, `#d9d9d9`, `#8c8c8c`
- **Success/Error**: Standard Ant Design colors

## 🔄 Future Enhancements

- [ ] Export to CSV/Excel
- [ ] Advanced sorting options
- [ ] Real-time data synchronization
- [ ] Multi-user collaboration
- [ ] Custom dashboard views
- [ ] API integration
- [ ] Dark mode support

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ for Axcera Analytics**