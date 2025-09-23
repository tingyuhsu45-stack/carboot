import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../blocs/carboot_bloc.dart';
import '../models/carboot_sale.dart';
import '../theme/app_theme.dart';
import 'detail_screen.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final MapController _mapController = MapController();
  CarBootSale? _selectedSale;

  // London center coordinates
  static const LatLng _londonCenter = LatLng(51.5074, -0.1278);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Car Boot Map'),
        actions: [
          IconButton(
            icon: const Icon(Icons.my_location),
            onPressed: _centerOnLondon,
            tooltip: 'Center on London',
          ),
        ],
      ),
      body: BlocBuilder<CarBootBloc, CarBootState>(
        builder: (context, state) {
          if (state is CarBootLoading) {
            return const Center(child: CircularProgressIndicator());
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
                    'Error loading map',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 8),
                  Text(state.message),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      context.read<CarBootBloc>().add(const LoadCarBootSales());
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          } else if (state is CarBootLoaded) {
            final sales = state.filteredSales;

            return Stack(
              children: [
                // Map
                FlutterMap(
                  mapController: _mapController,
                  options: MapOptions(
                    initialCenter: _londonCenter,
                    initialZoom: 10.0,
                    minZoom: 8.0,
                    maxZoom: 18.0,
                    onTap: (tapPosition, point) {
                      setState(() {
                        _selectedSale = null;
                      });
                    },
                  ),
                  children: [
                    // OpenStreetMap tile layer (FREE!)
                    TileLayer(
                      urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                      userAgentPackageName: 'com.example.carboot_finder',
                      maxNativeZoom: 19,
                    ),

                    // Markers for car boot sales
                    MarkerLayer(
                      markers: sales.map((sale) {
                        final isSelected = _selectedSale?.id == sale.id;

                        return Marker(
                          point: LatLng(sale.latitude, sale.longitude),
                          width: isSelected ? 50 : 40,
                          height: isSelected ? 50 : 40,
                          child: GestureDetector(
                            onTap: () {
                              setState(() {
                                _selectedSale = sale;
                              });
                              _mapController.move(
                                LatLng(sale.latitude, sale.longitude),
                                _mapController.camera.zoom < 14 ? 14 : _mapController.camera.zoom,
                              );
                            },
                            child: Container(
                              decoration: BoxDecoration(
                                color: isSelected 
                                    ? AppTheme.lightGreen 
                                    : AppTheme.primaryGreen,
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: Colors.white,
                                  width: 2,
                                ),
                                boxShadow: AppTheme.cardShadow,
                              ),
                              child: Icon(
                                Icons.storefront,
                                color: Colors.white,
                                size: isSelected ? 24 : 20,
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),

                // Selected sale info card
                if (_selectedSale != null)
                  Positioned(
                    bottom: 16,
                    left: 16,
                    right: 16,
                    child: Card(
                      elevation: 8,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    _selectedSale!.name,
                                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                if (_selectedSale!.isVerified)
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 8,
                                      vertical: 4,
                                    ),
                                    decoration: BoxDecoration(
                                      color: AppTheme.verifiedBadge,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: const Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Icon(
                                          Icons.verified,
                                          size: 14,
                                          color: Colors.white,
                                        ),
                                        SizedBox(width: 4),
                                        Text(
                                          'Verified',
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontSize: 12,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 8),

                            Row(
                              children: [
                                const Icon(
                                  Icons.location_on,
                                  size: 16,
                                  color: AppTheme.primaryGreen,
                                ),
                                const SizedBox(width: 4),
                                Expanded(
                                  child: Text(
                                    _selectedSale!.address,
                                    style: Theme.of(context).textTheme.bodyMedium,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),

                            Row(
                              children: [
                                const Icon(
                                  Icons.access_time,
                                  size: 16,
                                  color: AppTheme.primaryGreen,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  '${_selectedSale!.openingTime} - ${_selectedSale!.closingTime}',
                                  style: Theme.of(context).textTheme.bodyMedium,
                                ),
                                const Spacer(),
                                Row(
                                  children: [
                                    const Icon(
                                      Icons.star,
                                      size: 16,
                                      color: AppTheme.ratingStars,
                                    ),
                                    const SizedBox(width: 2),
                                    Text(
                                      '${_selectedSale!.rating.toStringAsFixed(1)} (${_selectedSale!.reviewCount})',
                                      style: Theme.of(context).textTheme.bodySmall,
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),

                            Row(
                              children: [
                                Expanded(
                                  child: OutlinedButton(
                                    onPressed: () {
                                      Navigator.of(context).push(
                                        MaterialPageRoute(
                                          builder: (context) => DetailScreen(sale: _selectedSale!),
                                        ),
                                      );
                                    },
                                    child: const Text('View Details'),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                IconButton(
                                  onPressed: () {
                                    setState(() {
                                      _selectedSale = null;
                                    });
                                  },
                                  icon: const Icon(Icons.close),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),

                // Legend
                Positioned(
                  top: 16,
                  right: 16,
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 16,
                                height: 16,
                                decoration: const BoxDecoration(
                                  color: AppTheme.primaryGreen,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Text('Car Boot Sale', style: TextStyle(fontSize: 12)),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${sales.length} locations',
                            style: const TextStyle(fontSize: 10, color: AppTheme.neutralGrey),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            );
          }

          return const Center(child: Text('No data available'));
        },
      ),
    );
  }

  void _centerOnLondon() {
    _mapController.move(_londonCenter, 10.0);
    setState(() {
      _selectedSale = null;
    });
  }
}
