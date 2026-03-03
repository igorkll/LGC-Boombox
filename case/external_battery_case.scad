$fn = 100;

width = 140;
length = 170;
height = 30;

thickness = 5;

hole_diameter = 3;
hole_depth = 10;

bracing_width = 30;
bracing_length = 4;
bracing_height = 10;
bracing_holo_offset = 10;

right = true;

difference() {
    cube([width, length, height]);
    
    translate([thickness, thickness, thickness]) {
        cube([width, length - thickness * 2, height + 2]);
    }
    
    holes_height_pos = (height - hole_depth) + 1;
    holes_h = hole_depth + 1;

    translate([thickness / 2, thickness / 2, holes_height_pos]) {
        cylinder(holes_h, d = hole_diameter);
    }

    translate([thickness / 2, length - (thickness / 2), holes_height_pos]) {
        cylinder(holes_h, d = hole_diameter);
    }

    translate([width - (thickness / 2), thickness / 2, holes_height_pos]) {
        cylinder(holes_h, d = hole_diameter);
    }

    translate([width - (thickness / 2), length - (thickness / 2), holes_height_pos]) {
        cylinder(holes_h, d = hole_diameter);
    }

    translate([width / 2, thickness / 2, holes_height_pos]) {
        cylinder(holes_h, d = hole_diameter);
    }

    translate([width / 2, length - (thickness / 2), holes_height_pos]) {
        cylinder(holes_h, d = hole_diameter);
    }
    
    translate([thickness / 2, length / 2, holes_height_pos]) {
        cylinder(holes_h, d = hole_diameter);
    }
}
