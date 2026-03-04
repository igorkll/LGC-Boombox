$fn = 100;

width = 260 / 2;
length = 170;

thickness = 5;

hole_diameter = 3;

bracing_width = 30;
bracing_length = 4;
bracing_height = 10;
bracing_holo_offset = 10;

logo_hole_offset = 20;
logo_hole_center_offset = 30;

difference() {
    cube([width, length, thickness]);
    
    holes_height_pos = -1;
    holes_h = thickness + 2;

    // back holes
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
    
    // logo hole
    translate([width - logo_hole_center_offset, logo_hole_offset, holes_height_pos]) {
        cylinder(h = holes_h, d = hole_diameter);
    }
    translate([width - logo_hole_center_offset, length - logo_hole_offset, holes_height_pos]) {
        cylinder(h = holes_h, d = hole_diameter);
    }
    translate([width - logo_hole_center_offset, length / 2, holes_height_pos]) {
        cylinder(h = holes_h, d = hole_diameter);
    }
}
