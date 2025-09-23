import 'package:flutter/material.dart';

class AppTheme {
  // Eco-friendly color palette
  static const Color primaryGreen = Color(0xFF2E7D32); // Dark green
  static const Color lightGreen = Color(0xFF4CAF50); // Light green
  static const Color accentGreen = Color(0xFF81C784); // Accent green
  static const Color earthBrown = Color(0xFF5D4037); // Earth brown
  static const Color leafGreen = Color(0xFF689F38); // Leaf green
  static const Color skyBlue = Color(0xFF0277BD); // Sky blue for water/air
  static const Color sunYellow = Color(0xFFFBC02D); // Sun yellow
  static const Color neutralGrey = Color(0xFF616161); // Neutral grey
  static const Color lightGrey = Color(0xFFF5F5F5); // Light background

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryGreen,
        brightness: Brightness.light,
        primary: primaryGreen,
        secondary: leafGreen,
        tertiary: sunYellow,
        surface: Colors.white,
        background: lightGrey,
        error: Colors.red.shade700,
      ),

      // App Bar Theme
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        backgroundColor: primaryGreen,
        foregroundColor: Colors.white,
        elevation: 2,
      ),

      // Card Theme
      cardTheme: CardTheme(
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        color: Colors.white,
      ),

      // Elevated Button Theme
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryGreen,
          foregroundColor: Colors.white,
          elevation: 3,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(25),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        ),
      ),

      // Floating Action Button Theme
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: leafGreen,
        foregroundColor: Colors.white,
        elevation: 6,
      ),

      // Chip Theme
      chipTheme: ChipThemeData(
        backgroundColor: accentGreen.withOpacity(0.2),
        labelStyle: const TextStyle(color: primaryGreen),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
      ),

      // Icon Theme
      iconTheme: const IconThemeData(
        color: primaryGreen,
        size: 24,
      ),

      // Text Theme
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          color: primaryGreen,
          fontWeight: FontWeight.bold,
        ),
        headlineMedium: TextStyle(
          color: primaryGreen,
          fontWeight: FontWeight.w600,
        ),
        bodyLarge: TextStyle(
          color: Colors.black87,
        ),
        bodyMedium: TextStyle(
          color: Colors.black54,
        ),
      ),

      // Input Decoration Theme
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: neutralGrey),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: primaryGreen, width: 2),
        ),
        fillColor: Colors.white,
        filled: true,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),

      // Bottom Navigation Bar Theme
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Colors.white,
        selectedItemColor: primaryGreen,
        unselectedItemColor: neutralGrey,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),

      // Divider Theme
      dividerTheme: const DividerThemeData(
        color: neutralGrey,
        thickness: 1,
        space: 1,
      ),
    );
  }

  // Custom colors for specific use cases
  static const Color verifiedBadge = leafGreen;
  static const Color ratingStars = sunYellow;
  static const Color facilityIcon = skyBlue;
  static const Color successColor = lightGreen;
  static const Color warningColor = sunYellow;
  static const Color errorColor = Colors.red;

  // Gradient for eco-themed backgrounds
  static const LinearGradient ecoGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFF4CAF50),
      Color(0xFF2E7D32),
    ],
  );

  // Shadow for cards
  static const List<BoxShadow> cardShadow = [
    BoxShadow(
      color: Colors.black12,
      blurRadius: 8,
      offset: Offset(0, 2),
    ),
  ];
}
