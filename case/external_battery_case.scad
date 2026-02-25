$fn = 100;

width = 140;
length = 170;
height = 40;

thickness = 5;

hole_diameter = 3;
hole_offset = 2.5;
hole_depth = 10;

legs_border_offset = 10;
legs_center_offset = 30;

bracing_width = 30;
bracing_length = 4;
bracing_height = 10;
bracing_holo_offset = 10;

buttons_offset = 20;
buttons_border_offset = 20;
buttons_gap = 20;
buttons_diameters = [11, 16];

right = true;

module holes(pos) {
    translate([hole_offset, hole_offset, pos]) {
        cylinder(h = hole_depth + 1, d = hole_diameter);
    }
    translate([hole_offset, length - hole_offset, pos]) {
        cylinder(h = hole_depth + 1, d = hole_diameter);
    }
    translate([width - hole_offset, hole_offset, pos]) {
        cylinder(h = hole_depth + 1, d = hole_diameter);
    }
    translate([width - hole_offset, length - hole_offset, pos]) {
        cylinder(h = hole_depth + 1, d = hole_diameter);
    }
    translate([width / 2, hole_offset, pos]) {
        cylinder(h = hole_depth + 1, d = hole_diameter);
    }
    translate([width / 2, length - hole_offset, pos]) {
        cylinder(h = hole_depth + 1, d = hole_diameter);
    }
    translate([hole_offset, length / 2, pos]) {
        cylinder(h = hole_depth + 1, d = hole_diameter);
    }
}

module buttons() {
    for (index = [0 : len(buttons_diameters) - 1]) {
        diameter = buttons_diameters[index];
        
        translate([index * buttons_gap, 0, 0]) {
            cylinder(h = thickness + 2, d = diameter);
        }
    }
}

difference() {
    cube([width, length, height]);
    
    translate([thickness, thickness, -1]) {
        cube([width, length - thickness * 2, height + 2]);
    }
    
    if (right) {
        translate([legs_center_offset, length + 1, legs_border_offset]) {
            rotate([90, 0, 0]) {
                cylinder(h = thickness + 2, d = hole_diameter);
            }
        }

        translate([legs_center_offset, length + 1, height - legs_border_offset]) {
            rotate([90, 0, 0]) {
                cylinder(h = thickness + 2, d = hole_diameter);
            }
        }
    } else {
        translate([legs_center_offset, thickness + 1, legs_border_offset]) {
            rotate([90, 0, 0]) {
                cylinder(h = thickness + 2, d = hole_diameter);
            }
        }

        translate([legs_center_offset, thickness + 1, height - legs_border_offset]) {
            rotate([90, 0, 0]) {
                cylinder(h = thickness + 2, d = hole_diameter);
            }
        }

        translate([buttons_offset, length + 1, height - buttons_border_offset]) {
            rotate([90, 0, 0]) {
                buttons();
            }
        }
    }
    
    holes(-1);
    holes(height - hole_depth);
}

module bracing() {
    difference() {
        cube([bracing_length, bracing_width, bracing_height], center = true);
        
        rotate([0, 90, 0]) {
            cylinder(h = bracing_length + 1, d = hole_diameter, center = true);
        }
        
        translate([0, bracing_holo_offset, 0]) {
            rotate([0, 90, 0]) {
                cylinder(h = bracing_length + 1, d = hole_diameter, center = true);
            }
        }
        
        translate([0, -bracing_holo_offset, 0]) {
            rotate([0, 90, 0]) {
                cylinder(h = bracing_length + 1, d = hole_diameter, center = true);
            }
        }
    }
}

translate([width - (bracing_length / 2), thickness * 2, height / 2]) {  
    rotate([90, 0, 0]) {
        bracing();
    }
}

translate([width - (bracing_length / 2), length - thickness * 2, height / 2]) {  
    rotate([90, 0, 0]) {
        bracing();
    }
}