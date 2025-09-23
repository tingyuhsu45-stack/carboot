import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'blocs/carboot_bloc.dart';
import 'repositories/carboot_repository.dart';
import 'screens/home_screen.dart';
import 'screens/map_screen.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(const CarBootFinderApp());
}

class CarBootFinderApp extends StatelessWidget {
  const CarBootFinderApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => CarBootBloc(CarBootRepository())..add(const LoadCarBootSales()),
      child: MaterialApp(
        title: 'Car Boot Finder',
        theme: AppTheme.lightTheme,
        home: const MainScreen(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const HomeScreen(),
    const MapScreen(),
  ];

  final List<String> _screenTitles = [
    'Car Boot Sales',
    'Map View',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.list),
            activeIcon: Icon(Icons.list_alt),
            label: 'List',
            tooltip: 'View car boot sales list',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.map_outlined),
            activeIcon: Icon(Icons.map),
            label: 'Map',
            tooltip: 'View car boot sales on map',
          ),
        ],
      ),
    );
  }
}
