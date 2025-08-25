$fn = 100;

width = 185;
length = 170;
height = 70;

thickness = 5;

hole_diameter = 3;
hole_offset = 2.5;
hole_depth = 15;

leds_width = 13;
leds_height = 5;
leds_offset = 30;

handle_length = 150;
handle_hole_offset = 2.5;

legs_border_offset = 10;
legs_center_offset = 30;

bracing_width = 30;
bracing_length = 4;
bracing_height = 10;
bracing_holo_offset = 10;

right = false;

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

difference() {
    cube([width, length, height]);
    
    translate([thickness, thickness, -1]) {
        cube([width, length - thickness * 2, height + 2]);
    }
    
    if (right) {
        translate([leds_offset, length - (thickness / 2), height / 2]) {
            cube([leds_width, thickness + 1, leds_height], center = true);
        }
        
        translate([width - (handle_length / 2) - handle_hole_offset, thickness + 1, height / 2]) {
            rotate([90, 0, 0]) {
                cylinder(h = thickness + 2, d = hole_diameter);
            }
        }

        translate([width - (handle_length / 2) + handle_hole_offset, thickness + 1, height / 2]) {
            rotate([90, 0, 0]) {
                cylinder(h = thickness + 2, d = hole_diameter);
            }
        }
        
        translate([legs_center_offset, length + 1, legs_offset]) {
            rotate([90, 0, 0]) {
                cylinder(h = thickness + 2, d = hole_diameter);
            }
        }

        translate([legs_center_offset, length + 1, height - legs_offset]) {
            rotate([90, 0, 0]) {
                cylinder(h = thickness + 2, d = hole_diameter);
            }
        }
    } else {
        translate([leds_offset, thickness / 2, height / 2]) {
            cube([leds_width, thickness + 1, leds_height], center = true);
        }
        
        translate([width - (handle_length / 2) - handle_hole_offset, length + 1, height / 2]) {
            rotate([90, 0, 0]) {
                cylinder(h = thickness + 2, d = hole_diameter);
            }
        }

        translate([width - (handle_length / 2) + handle_hole_offset, length + 1, height / 2]) {
            rotate([90, 0, 0]) {
                cylinder(h = thickness + 2, d = hole_diameter);
            }
        }
        
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