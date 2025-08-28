$fn = 100;

width = 185;
length = 170;
height = 5;

hole_diameter = 3;
hole_offset = 2.5;

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
aux_height = 2;

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
        translate([aux_offset, aux_offset, aux_height]) {
            cylinder(h = height + 1, d = aux_deep_diameter);
        }
        
        translate([aux_offset, aux_offset, height / 2]) {
            cylinder(h = height + 1, d = aux_diameter, center = true);
        }
    }
}