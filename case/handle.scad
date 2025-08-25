$fn = 100;

handle_length = 150;
handle_width = 10;
handle_height = 30;

hole_diameter = 3;
hole_offset = 5;
hole_depth = 15;

rotate([0, 90, 0]) {
    cylinder(h = handle_length, d = handle_width, center = true);
}

translate([handle_length / 2, 0, 0]) {
    cube([handle_width, handle_width, handle_width], center = true);
    translate([0, 0, handle_width / 2]) {
        cylinder(h = handle_height, d = handle_width);
    }
}

difference() {
    translate([handle_length / -2, 0, 0]) {
        cube([handle_width, handle_width, handle_width], center = true);
        translate([0, 0, handle_width / -2]) {
            cylinder(h = handle_height, d = handle_width);
        }
    }
    
    translate([handle_length / -2, 0, 0]) {
        cylinder(h = hole_depth, d = hole_diameter, center = true);
    }
}