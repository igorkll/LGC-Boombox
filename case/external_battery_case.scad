$fn = 100;

width = 140;
length = 170;
height = 40;

thickness = 5;

hole_diameter = 3;
hole_offset = 2.5;
hole_depth = 10;

bracing_width = 30;
bracing_length = 4;
bracing_height = 10;
bracing_holo_offset = 10;

right = true;

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