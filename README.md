# Car Boot Finder - Flutter App

A Flutter application for discovering car boot sales in London with eco-friendly mission to help young people give items a new life.

## Features

- 📍 **Map View**: Interactive map showing car boot sale locations using free OpenStreetMap
- 📋 **List View**: Browse car boot sales with search and filtering
- 🔍 **Search & Filter**: Find sales by name, location, date, and area
- ⭐ **Ratings & Reviews**: See ratings and review counts for each sale
- ✅ **Verified Organisers**: Trust indicators for verified car boot organisers
- 🌱 **Eco-Friendly**: Focus on sustainability and giving items new life
- 📱 **Material Design**: Clean, modern UI with eco-themed colors

## Tech Stack

- **Flutter**: Cross-platform mobile development
- **BLoC**: State management pattern
- **flutter_map**: Free map implementation using OpenStreetMap
- **Material Design 3**: Modern UI components with eco-friendly theme

## Project Structure

```
lib/
├── blocs/               # BLoC state management
│   └── carboot_bloc.dart
├── models/              # Data models
│   └── carboot_sale.dart
├── repositories/        # Data layer with mock data
│   └── carboot_repository.dart
├── screens/             # UI screens
│   ├── home_screen.dart
│   ├── map_screen.dart
│   └── detail_screen.dart
├── widgets/             # Reusable widgets
│   └── carboot_card.dart
├── theme/               # App theming
│   └── app_theme.dart
└── main.dart           # App entry point
```

## Getting Started

### Prerequisites

- Flutter SDK (3.0.0 or higher)
- Dart SDK
- Android Studio / VS Code
- Android/iOS device or emulator

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   flutter pub get
   ```
3. Run the app:
   ```bash
   flutter run
   ```

## Mock Data

The app currently uses mock data for 8 car boot sales across London including:
- Bermondsey Market Car Boot
- Pimlico Road Farmers Market Car Boot
- Wimbledon Stadium Car Boot Sale
- Battersea Boot Fair
- Crystal Palace Car Boot
- Greenwich Market Car Boot
- Elephant & Castle Car Boot
- Tooting Car Boot Sale

## Future Implementation

This MVP can be extended with:
- Real data integration using LLM-powered web scraping
- User authentication and reviews
- Organiser claim system
- Push notifications
- Social sharing features
- Offline support

## Free Map Implementation

This app uses **flutter_map** with OpenStreetMap tiles, which is completely free and doesn't require API keys or billing setup, making it perfect for a solo developer side project.

## Architecture

The app follows clean architecture principles:
- **Presentation Layer**: UI widgets and screens
- **BLoC Layer**: State management and business logic
- **Repository Layer**: Data abstraction
- **Model Layer**: Data structures

## Contributing

This is a solo side project, but suggestions and feedback are welcome!

## License

This project is open source and available under the MIT License.
