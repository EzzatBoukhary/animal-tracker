import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'login_page.dart'; 
// import 'registration_page.dart';   
// import 'api_service.dart';


void main() {
  runApp(const MyApp());
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
            backgroundColor: const Color(0xFFFFC904), // AppBar color
          ),
          bottomNavigationBarTheme: BottomNavigationBarThemeData(
            backgroundColor: const Color(0xFFFFC904), // BottomNavigationBar color
          ),
          scaffoldBackgroundColor: Colors.white, // Set default background color
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

  void logout() {
    _isLoggedIn = false;
    notifyListeners();
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  var selectedIndex = 0;

  

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    Widget page;
    switch (selectedIndex) {
      case 0:
        page = Placeholder();
        break;
      case 1:
        page = Placeholder();
        break;
      case 2:
        page = Placeholder();
        break;
      default:
        throw UnimplementedError('no widget for $selectedIndex');
    }

    return LayoutBuilder(
      builder: (context, constraints) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('UCF Animal Tracker'),
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
          body: Column(
            children: [
              SafeArea(
                child: Expanded(
                  child: Container(
                    color: Theme.of(context).colorScheme.onPrimary,
                    child: page,
                  ),
                ),
              ),
            ],
          ),
          bottomNavigationBar: BottomNavigationBar(
            backgroundColor: const Color(0xFFFFC904),
            items: const [
              BottomNavigationBarItem(icon: Icon(Icons.post_add), label: 'Posts'),
              BottomNavigationBarItem(icon: Icon(Icons.create), label: 'Create Post'),
              BottomNavigationBarItem(icon: Icon(Icons.map), label: 'Map'),
            ],
            onTap: (index) {
              setState(() {
                selectedIndex = index;
              });
            },
          ),
        );
      },
    );
  }
}
