/*
 *   Copyright 2018 John Salatas <jsalatas@ictpro.gr>
 *
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU Library General Public License as
 *   published by the Free Software Foundation; either version 2 or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details
 *
 *   You should have received a copy of the GNU Library General Public
 *   License along with this program; if not, write to the
 *   Free Software Foundation, Inc.,
 *   51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

function to_int(item) {
    var val = Math.round(parseFloat(item['value']), 0);
    return 0 == val || val ? val + item['unit'] : '';
}

function array_to_int(items) {
    var res = '';
    var keys = Object.keys(items['value'])
    for (var i = 0; i < keys.length; i++) {
        var item = items['value'][keys[i]]
        var val = Math.round(parseFloat(item), 0);
        if (0 == val || val) {
            if (res) {
                res += ' | '
            }
            res += val + items['unit'];
        }
    };
    return res;
}

function to_time(item) {
    var val = Math.round(parseFloat(item['value']), 0);
    var hours = Math.floor(val / 3600);
    var minutes = Math.floor((val - (hours * 3600)) / 60);

    if (minutes < 10) { minutes = "0" + minutes; }
    return hours ? hours + ':' + minutes : '';
}

function to_bool(item) {
    return parseInt(item['value'], 10) == 1;
}

function to_string(item) {
    return item['value'];
}

var sensors = {
    // Informational
    'cpu_cur_load': { 'value': undefined, 'unit': '%', 'print': to_int },
    'cpu_cur_freq': { 'value': undefined, 'unit': ' MHz', 'print': to_int },
    'cpu_total_available': { 'value': undefined, 'unit': '', 'print': to_int },
    'cpu_min_limit': { 'value': undefined, 'unit': '', 'print': to_int },
    'gpu_cur_freq': { 'value': undefined, 'unit': ' MHz', 'print': to_int },
    'gpu_min_limit': { 'value': undefined, 'unit': '', 'print': to_int },
    'gpu_max_limit': { 'value': undefined, 'unit': '', 'print': to_int },
    'battery_percentage': { 'value': undefined, 'unit': '%', 'print': to_int },
    'battery_remaining_time': { 'value': undefined, 'print': to_time },
    'package_temp': { 'value': undefined, 'unit': ' \u2103', 'print': to_int },
    'fan_speeds': { 'value': {}, 'unit': ' RPM', 'print': array_to_int },
    // Tunable
    'cpu_min_perf': { 'value': undefined, 'unit': '%', 'print': to_int },
    'cpu_max_perf': { 'value': undefined, 'unit': '%', 'print': to_int },
    'cpu_turbo': { 'value': undefined, 'unit': '', 'print': to_bool },
    'cpu_online': { 'value': undefined, 'unit': '', 'print': to_int },
    'gpu_min_freq': { 'value': undefined, 'unit': ' MHz', 'print': to_int },
    'gpu_max_freq': { 'value': undefined, 'unit': ' MHz', 'print': to_int },
    'gpu_boost_freq': { 'value': undefined, 'unit': ' MHz', 'print': to_int },
    'cpu_governor': { 'value': undefined, 'unit': '', 'print': to_string },
    'energy_perf': { 'value': undefined, 'unit': '', 'print': to_string },
    'thermal_mode': { 'value': undefined, 'unit': '', 'print': to_string },
    'powermizer': { 'value': undefined, 'unit': '', 'print': to_string },

}

var vendors = {
    'dell': { 'provides': ['thermal_mode'] },
    'nvidia': { 'provides': ['powermizer'] }
}

var model = [
    {
        'type': 'header', 'text': 'CPU', 'icon': 'd',
        'sensors': ['cpu_cur_load', 'cpu_cur_freq'],
        'items': [
            // {
            //     'type': 'group', 'text': 'Multiprocessing', 'visible': 'showCoreCount', 'items': [
            //         { 'type': 'slider', 'text': 'Cores', 'min': 1, 'max': 'cpu_total_available', 'sensor': 'cpu_online' },
            //     ]
            // },
            {
                'type': 'group', 'text': 'Performance', 'items': [
                    { 'type': 'slider', 'text': 'Min frequency', 'min': 'cpu_min_limit', 'max': 100, 'sensor': 'cpu_min_perf' },
                    { 'type': 'slider', 'text': 'Max frequency', 'min': 'cpu_min_limit', 'max': 100, 'sensor': 'cpu_max_perf' },
                    { 'type': 'switch', 'text': 'Turbo', 'sensor': 'cpu_turbo' }
                ]
            },
            {
                'type': 'group', 'text': 'iGPU', 'visible': 'showIntelGPU', 'items': [
                    { 'type': 'slider', 'text': 'Min frequency', 'min': 'gpu_min_limit', 'max': 'gpu_max_limit', 'sensor': 'gpu_min_freq' },
                    { 'type': 'slider', 'text': 'Max frequency', 'min': 'gpu_min_limit', 'max': 'gpu_max_limit', 'sensor': 'gpu_max_freq' },
                    { 'type': 'slider', 'text': 'Boost frequency', 'min': 'gpu_min_limit', 'max': 'gpu_max_limit', 'sensor': 'gpu_boost_freq' },
                ]
            },
            {
                'type': 'radio', 'text': 'Governor', 'sensor': 'cpu_governor', 'items': [
                    { 'symbol': 'a', 'text': 'Performance', 'sensor_value': 'performance' },
                    { 'symbol': 'f', 'text': 'Powersave', 'sensor_value': 'powersave' }
                ]
            }
        ]
    },
    {
        'type': 'header', 'text': 'Nvidia GPU', 'icon': 'o',
        'vendors': ['nvidia'],
        'items': [
            {
                'type': 'combobox', 'text': 'PowerMizer', 'sensor': 'powermizer', 'items': [
                    { 'text': 'Adaptive', 'sensor_value': '0' },
                    { 'text': 'Prefer Max Performance', 'sensor_value': '1' },
                    { 'text': 'Auto', 'sensor_value': '2' }
                ]
            }
        ]
    },
    {
        'type': 'header', 'text': 'Thermal Management', 'icon': 'b',
        'vendors': ['dell'],
        'sensors': ['package_temp', 'fan_speeds'],
        'items': [
            {
                'type': 'radio', 'text': '', 'sensor': 'thermal_mode', 'items': [
                    { 'symbol': 'e', 'text': 'Performance', 'sensor_value': 'performance' },
                    { 'symbol': 'j', 'text': 'Balanced', 'sensor_value': 'balanced' },
                    { 'symbol': 'g', 'text': 'Cool Bottom', 'sensor_value': 'cool-bottom' },
                    { 'symbol': 'c', 'text': 'Quiet', 'sensor_value': 'quiet' }
                ]
            }
        ]
    },
    {
        'type': 'header', 'text': 'Energy Performance', 'icon': 'h',
        'sensors': ['battery_percentage', 'battery_remaining_time'],
        'items': [
            {
                'type': 'radio', 'text': '', 'sensor': 'energy_perf', 'items': [
                    { 'symbol': 'a', 'text': 'Performance', 'sensor_value': 'performance' },
                    { 'symbol': 'k', 'text': 'Balance Performance', 'sensor_value': 'balance_performance' },
                    { 'symbol': 'l', 'text': 'Balance Power', 'sensor_value': 'balance_power' },
                    { 'symbol': 'f', 'text': 'Power', 'sensor_value': 'power' }
                ]
            }
        ]
    }
]

function get_model() {
    return model;
}

function get_sensors() {
    return sensors;
}

function get_vendors() {
    return vendors;
}

