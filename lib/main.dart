import 'package:carboot_finder/blocs/auth_bloc/auth_bloc.dart';
import 'package:carboot_finder/services/appwrite_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'blocs/carboot_bloc.dart';
import 'repositories/carboot_repository.dart';
import 'repositories/auth_repository.dart';

import 'screens/main_screen.dart';
import 'screens/login_screen.dart';
import 'screens/signup_screen.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    await AppwriteService.instance.init(
      endpoint: "https://fra.cloud.appwrite.io/v1",
      projectId: "68d3ba6e00247030f643",
    );

    runApp(const CarBootFinderApp());

  } catch (e, stack) {
    debugPrint('Fatal error during app init: $e\n$stack');
  }
}


class CarBootFinderApp extends StatelessWidget {
  const CarBootFinderApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) => AuthBloc(AuthRepository())..add(AuthCheckRequested()),
        ),
        BlocProvider(
          create: (context) =>
              CarBootBloc(CarBootRepository())..add(const LoadCarBootSales()),
        ),
      ],
      child: MaterialApp(
        title: 'Car Boot Finder',
        theme: AppTheme.lightTheme,
        debugShowCheckedModeBanner: false,
        home: BlocBuilder<AuthBloc, AuthState>(
          builder: (context, state) {
            if (state is AuthLoading || state is AuthInitial) {
              return const Scaffold(
                body: Center(child: CircularProgressIndicator()),
              );
            } else if (state is AuthAuthenticated) {
              return const MainScreen();
            } else {
              return const LoginScreen();
            }
          },
        ),
        routes: {
          '/login': (_) => const LoginScreen(),
          '/signup': (_) => const SignupScreen(),
          '/main': (_) => const MainScreen(),
        },
      ),
    );
  }
}
