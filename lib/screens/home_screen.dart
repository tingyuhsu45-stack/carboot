import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import '../blocs/carboot_bloc.dart';
import '../models/carboot_sale.dart';
import '../widgets/carboot_card.dart';
import '../theme/app_theme.dart';
import 'detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedArea = 'All Areas';
  DateTime? _selectedDate;

  final List<String> _areas = [
    'All Areas',
    'Bermondsey',
    'Pimlico',
    'Wimbledon',
    'Battersea',
    'Crystal Palace',
    'Greenwich',
    'Elephant & Castle',
    'Tooting',
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Car Boot Finder'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              context.read<CarBootBloc>().add(const RefreshCarBootSales());
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Search and Filter Section
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: AppTheme.ecoGradient.scale(0.1),
              boxShadow: const [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 4,
                  offset: Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              children: [
                // Search Bar
                TextField(
                  controller: _searchController,
                  decoration: const InputDecoration(
                    hintText: 'Search car boot sales...',
                    prefixIcon: Icon(Icons.search),
                    suffixIcon: null,
                  ),
                  onChanged: (query) {
                    context.read<CarBootBloc>().add(SearchCarBootSales(query));
                  },
                ),
                const SizedBox(height: 12),

                // Filters Row
                Row(
                  children: [
                    // Area Filter
                    Expanded(
                      flex: 2,
                      child: DropdownButtonFormField<String>(
                        initialValue: _selectedArea,
                        decoration: const InputDecoration(
                          labelText: 'Area',
                          contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        items: _areas.map((area) {
                          return DropdownMenuItem(
                            value: area,
                            child: Text(area),
                          );
                        }).toList(),
                        onChanged: (value) {
                          setState(() {
                            _selectedArea = value!;
                          });
                          _applyFilters();
                        },
                      ),
                    ),
                    const SizedBox(width: 8),

                    // Date Filter
                    Expanded(
                      flex: 2,
                      child: InkWell(
                        onTap: _selectDate,
                        child: InputDecorator(
                          decoration: const InputDecoration(
                            labelText: 'Date',
                            suffixIcon: Icon(Icons.calendar_today),
                            contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          ),
                          child: Text(
                            _selectedDate != null
                                ? DateFormat('MMM d').format(_selectedDate!)
                                : 'Any date',
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),

                    // Clear Filters
                    IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: _clearFilters,
                      tooltip: 'Clear filters',
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Results Section
          Expanded(
            child: BlocBuilder<CarBootBloc, CarBootState>(
              builder: (context, state) {
                if (state is CarBootLoading) {
                  return const Center(
                    child: CircularProgressIndicator(),
                  );
                } else if (state is CarBootError) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.error_outline,
                          size: 64,
                          color: AppTheme.errorColor,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Oops! Something went wrong',
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          state.message,
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            context.read<CarBootBloc>().add(const LoadCarBootSales());
                          },
                          child: const Text('Try Again'),
                        ),
                      ],
                    ),
                  );
                } else if (state is CarBootLoaded) {
                  final sales = state.filteredSales;

                  if (sales.isEmpty) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.search_off,
                            size: 64,
                            color: AppTheme.neutralGrey,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'No car boot sales found',
                            style: Theme.of(context).textTheme.headlineSmall,
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'Try adjusting your search or filters',
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    );
                  }

                  return Column(
                    children: [
                      // Results count
                      if (state.currentQuery.isNotEmpty || _hasActiveFilters())
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            children: [
                              Text(
                                '${sales.length} results found',
                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              if (state.currentQuery.isNotEmpty) ...[
                                const Text(' for '),
                                Text(
                                  '"${state.currentQuery}"',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.primaryGreen,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),

                      // Car boot sales list
                      Expanded(
                        child: ListView.builder(
                          itemCount: sales.length,
                          itemBuilder: (context, index) {
                            final sale = sales[index];
                            return CarBootCard(
                              sale: sale,
                              onTap: () => _navigateToDetail(sale),
                            );
                          },
                        ),
                      ),
                    ],
                  );
                }

                return const SizedBox.shrink();
              },
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _selectDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );

    if (date != null) {
      setState(() {
        _selectedDate = date;
      });
      _applyFilters();
    }
  }

  void _applyFilters() {
    context.read<CarBootBloc>().add(
      FilterCarBootSales(
        date: _selectedDate,
        area: _selectedArea == 'All Areas' ? null : _selectedArea,
      ),
    );
  }

  void _clearFilters() {
    setState(() {
      _selectedArea = 'All Areas';
      _selectedDate = null;
      _searchController.clear();
    });

    context.read<CarBootBloc>().add(const LoadCarBootSales());
  }

  bool _hasActiveFilters() {
    return _selectedArea != 'All Areas' || _selectedDate != null;
  }

  void _navigateToDetail(CarBootSale sale) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => DetailScreen(sale: sale),
      ),
    );
  }
}
