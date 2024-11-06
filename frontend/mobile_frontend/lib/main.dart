import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'login_page.dart';
import 'create_page.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:geolocator/geolocator.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => MyAppState(),
      child: MaterialApp(
        title: 'UCF Animal Tracker',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFFFFC904)),
          appBarTheme: AppBarTheme(
            backgroundColor: const Color(0xFFFFC904),
          ),
          bottomNavigationBarTheme: BottomNavigationBarThemeData(
            backgroundColor: const Color(0xFFFFC904),
          ),
          scaffoldBackgroundColor: Colors.white,
          useMaterial3: true,
        ),
        home: Consumer<MyAppState>(
          builder: (context, appState, _) {
            return appState.isLoggedIn ? MyHomePage(title: 'UCF Animal Tracker') : LoginPage();
          },
        ),
      ),
    );
  }
}

class MyAppState extends ChangeNotifier {
  bool _isLoggedIn = false;

  bool get isLoggedIn => _isLoggedIn;

  void login() {
    _isLoggedIn = true;
    notifyListeners();
  }

  Future<void> logout() async {
    _isLoggedIn = false;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  var selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    Widget page;
    switch (selectedIndex) {
      case 0:
        page = Placeholder();
        break;
      case 1:
        page = CreatePage();
        break;
      case 2:
        page = Placeholder();
        break;
      default:
        throw UnimplementedError('No widget for $selectedIndex');
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: const Color(0xFFFFC904),
        actions: [
          IconButton(
            onPressed: () {
              // Navigate to profile page
            },
            icon: const Icon(Icons.account_circle),
          ),
        ],
      ),
      body: SafeArea(
        child: Container(
          color: Theme.of(context).colorScheme.onPrimary,
          child: page,
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: const Color(0xFFFFC904),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.post_add), label: 'Posts'),
          BottomNavigationBarItem(icon: Icon(Icons.create), label: 'Create Post'),
          BottomNavigationBarItem(icon: Icon(Icons.map), label: 'Map'),
        ],
        currentIndex: selectedIndex,
        onTap: (index) {
          setState(() {
            selectedIndex = index;
          });
        },
      ),
    );
  }
}

