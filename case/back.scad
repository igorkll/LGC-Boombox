$fn = 100;

width = 185;
length = 170;
height = 5;

hole_diameter = 3;
hole_offset = 2.5;

bracing_width = 30;
bracing_length = 4;
bracing_height = 10;
bracing_offset = 10;
bracing_holo_offset = 10;

logo_hole_offset = 20;
logo_hole_center_offset = 30;

right = false;

//right
power_connector_diameter = 11;
power_connector_offset = 20;

//left
aux_deep_diameter = 9;
aux_diameter = 6;
aux_offset = 20;

difference() {
    cube([width, length, height]);
    
    // holes
    translate([hole_offset, hole_offset, height / 2]) {
        cylinder(h = height + 1, d = hole_diameter, center = true);
    }
    translate([hole_offset, length - hole_offset, height / 2]) {
        cylinder(h = height + 1, d = hole_diameter, center = true);
    }
    translate([width - hole_offset, hole_offset, height / 2]) {
        cylinder(h = height + 1, d = hole_diameter, center = true);
    }
    translate([width - hole_offset, length - hole_offset, height / 2]) {
        cylinder(h = height + 1, d = hole_diameter, center = true);
    }
    translate([width / 2, hole_offset, height / 2]) {
        cylinder(h = height + 1, d = hole_diameter, center = true);
    }
    translate([width / 2, length - hole_offset, height / 2]) {
        cylinder(h = height + 1, d = hole_diameter, center = true);
    }
    translate([hole_offset, length / 2, height / 2]) {
        cylinder(h = height + 1, d = hole_diameter, center = true);
    }
    
    // logo hole
    translate([width - logo_hole_center_offset, logo_hole_offset, height / 2]) {
        cylinder(h = height + 1, d = hole_diameter, center = true);
    }
    translate([width - logo_hole_center_offset, length - logo_hole_offset, height / 2]) {
        cylinder(h = height + 1, d = hole_diameter, center = true);
    }
    translate([width - logo_hole_center_offset, length / 2, height / 2]) {
        cylinder(h = height + 1, d = hole_diameter, center = true);
    }
    
    if (right) {
        translate([power_connector_offset, length - power_connector_offset, height / 2]) {
            cylinder(h = height + 1, d = power_connector_diameter, center = true);
        }
    } else {
        translate([aux_offset, aux_offset, height]) {
            cylinder(h = height + 1, d = aux_deep_diameter, center = true);
        }
        
        translate([aux_offset, aux_offset, height / 2]) {
            cylinder(h = height + 1, d = aux_diameter, center = true);
        }
    }
}

module bracing(pos) {
    difference() {
        translate(pos) {    
            cube([bracing_length, bracing_width, bracing_height], center = true);
        }
        
        translate([pos[0], pos[1], pos[2]]) {
            rotate([0, 90, 0]) {
                cylinder(h = bracing_length + 1, d = hole_diameter, center = true);
            }
        }
        
        translate([pos[0], pos[1] + bracing_holo_offset, pos[2]]) {
            rotate([0, 90, 0]) {
                cylinder(h = bracing_length + 1, d = hole_diameter, center = true);
            }
        }
        
        translate([pos[0], pos[1] - bracing_holo_offset, pos[2]]) {
            rotate([0, 90, 0]) {
                cylinder(h = bracing_length + 1, d = hole_diameter, center = true);
            }
        }
    }
}

bracing([width - bracing_length / 2, (bracing_width / 2) + bracing_offset, height + bracing_height / 2]);
bracing([width - bracing_length / 2, (length - bracing_width / 2) - bracing_offset, height + bracing_height / 2]);
bracing([width - bracing_length / 2, length / 2, height + bracing_height / 2]);