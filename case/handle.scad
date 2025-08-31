$fn = 100;

handle_length = 170;
handle_width = 30;
handle_height = 30;

hole_diameter = 3;
hole_offset = 5;
hole_depth = 15;

rotate([0, 90, 0]) {
    cylinder(h = handle_length, d = handle_width, center = true);
}

difference() {
    translate([handle_length / 2, 0, 0]) {
        cube([handle_width, handle_width, handle_width], center = true);
        translate([0, 0, handle_width / 2]) {
            cylinder(h = handle_height, d = handle_width);
        }
    }
    
    translate([(handle_length / 2) + hole_offset, 0, (handle_height + (handle_width / 2)) - hole_depth]) {
        cylinder(h = hole_depth + 1, d = hole_diameter);
    }
    
    translate([(handle_length / 2) - hole_offset, 0, (handle_height + (handle_width / 2)) - hole_depth]) {
        cylinder(h = hole_depth + 1, d = hole_diameter);
    }
    
    translate([handle_length / 2, hole_offset, (handle_height + (handle_width / 2)) - hole_depth]) {
        cylinder(h = hole_depth + 1, d = hole_diameter);
    }
    
    translate([handle_length / 2, -hole_offset, (handle_height + (handle_width / 2)) - hole_depth]) {
        cylinder(h = hole_depth + 1, d = hole_diameter);
    }
}

difference() {
    translate([handle_length / -2, 0, 0]) {
        cube([handle_width, handle_width, handle_width], center = true);
        translate([0, 0, handle_width / 2]) {
            cylinder(h = handle_height, d = handle_width);
        }
    }
    
    translate([(handle_length / -2) + hole_offset, 0, (handle_height + (handle_width / 2)) - hole_depth]) {
        cylinder(h = hole_depth + 1, d = hole_diameter);
    }
    
    translate([(handle_length / -2) - hole_offset, 0, (handle_height + (handle_width / 2)) - hole_depth]) {
        cylinder(h = hole_depth + 1, d = hole_diameter);
    }
    
    translate([handle_length / -2, hole_offset, (handle_height + (handle_width / 2)) - hole_depth]) {
        cylinder(h = hole_depth + 1, d = hole_diameter);
    }
    
    translate([handle_length / -2, -hole_offset, (handle_height + (handle_width / 2)) - hole_depth]) {
        cylinder(h = hole_depth + 1, d = hole_diameter);
    }
}