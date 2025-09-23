import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../models/carboot_sale.dart';
import '../repositories/carboot_repository.dart';

// Events
abstract class CarBootEvent extends Equatable {
  const CarBootEvent();

  @override
  List<Object> get props => [];
}

class LoadCarBootSales extends CarBootEvent {
  const LoadCarBootSales();
}

class SearchCarBootSales extends CarBootEvent {
  final String query;

  const SearchCarBootSales(this.query);

  @override
  List<Object> get props => [query];
}

class FilterCarBootSales extends CarBootEvent {
  final DateTime? date;
  final String? area;
  final int? minSize;

  const FilterCarBootSales({this.date, this.area, this.minSize});

  @override
  List<Object> get props => [date ?? '', area ?? '', minSize ?? 0];
}

class RefreshCarBootSales extends CarBootEvent {
  const RefreshCarBootSales();
}

// States
abstract class CarBootState extends Equatable {
  const CarBootState();

  @override
  List<Object> get props => [];
}

class CarBootLoading extends CarBootState {
  const CarBootLoading();
}

class CarBootLoaded extends CarBootState {
  final List<CarBootSale> sales;
  final List<CarBootSale> filteredSales;
  final String currentQuery;

  const CarBootLoaded({
    required this.sales,
    required this.filteredSales,
    this.currentQuery = '',
  });

  @override
  List<Object> get props => [sales, filteredSales, currentQuery];

  CarBootLoaded copyWith({
    List<CarBootSale>? sales,
    List<CarBootSale>? filteredSales,
    String? currentQuery,
  }) {
    return CarBootLoaded(
      sales: sales ?? this.sales,
      filteredSales: filteredSales ?? this.filteredSales,
      currentQuery: currentQuery ?? this.currentQuery,
    );
  }
}

class CarBootError extends CarBootState {
  final String message;

  const CarBootError(this.message);

  @override
  List<Object> get props => [message];
}

// BLoC
class CarBootBloc extends Bloc<CarBootEvent, CarBootState> {
  final CarBootRepository _repository;

  CarBootBloc(this._repository) : super(const CarBootLoading()) {
    on<LoadCarBootSales>(_onLoadCarBootSales);
    on<SearchCarBootSales>(_onSearchCarBootSales);
    on<FilterCarBootSales>(_onFilterCarBootSales);
    on<RefreshCarBootSales>(_onRefreshCarBootSales);
  }

  Future<void> _onLoadCarBootSales(
    LoadCarBootSales event,
    Emitter<CarBootState> emit,
  ) async {
    try {
      emit(const CarBootLoading());
      final sales = await _repository.getCarBootSales();
      emit(CarBootLoaded(sales: sales, filteredSales: sales));
    } catch (e) {
      emit(CarBootError('Failed to load car boot sales: ${e.toString()}'));
    }
  }

  Future<void> _onSearchCarBootSales(
    SearchCarBootSales event,
    Emitter<CarBootState> emit,
  ) async {
    if (state is CarBootLoaded) {
      final currentState = state as CarBootLoaded;
      final filteredSales = currentState.sales.where((sale) {
        return sale.name.toLowerCase().contains(event.query.toLowerCase()) ||
            sale.location.toLowerCase().contains(event.query.toLowerCase()) ||
            sale.address.toLowerCase().contains(event.query.toLowerCase());
      }).toList();

      emit(currentState.copyWith(
        filteredSales: filteredSales,
        currentQuery: event.query,
      ));
    }
  }

  Future<void> _onFilterCarBootSales(
    FilterCarBootSales event,
    Emitter<CarBootState> emit,
  ) async {
    if (state is CarBootLoaded) {
      final currentState = state as CarBootLoaded;
      var filteredSales = currentState.sales;

      if (event.date != null) {
        filteredSales = filteredSales.where((sale) {
          return sale.date.year == event.date!.year &&
              sale.date.month == event.date!.month &&
              sale.date.day == event.date!.day;
        }).toList();
      }

      if (event.area != null && event.area!.isNotEmpty) {
        filteredSales = filteredSales.where((sale) {
          return sale.location.toLowerCase().contains(event.area!.toLowerCase());
        }).toList();
      }

      if (event.minSize != null) {
        filteredSales = filteredSales.where((sale) {
          return sale.estimatedSize >= event.minSize!;
        }).toList();
      }

      emit(currentState.copyWith(filteredSales: filteredSales));
    }
  }

  Future<void> _onRefreshCarBootSales(
    RefreshCarBootSales event,
    Emitter<CarBootState> emit,
  ) async {
    add(const LoadCarBootSales());
  }
}
