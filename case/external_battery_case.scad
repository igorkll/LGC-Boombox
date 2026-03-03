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

logo_hole_offset = 20;
logo_hole_center_offset = 30;

right = false;

wire_diameter = 3;
wire_offset = 20;

difference() {
    cube([width, length, height]);
    
    translate([thickness, thickness, thickness]) {
        cube([width, length - thickness * 2, height + 2]);
    }
    
    holes_height_pos = (height - hole_depth) + 1;
    holes_h = hole_depth + 1;

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
    translate([width - logo_hole_center_offset, logo_hole_offset, height / 2]) {
        cylinder(h = height + 1, d = hole_diameter, center = true);
    }
    translate([width - logo_hole_center_offset, length - logo_hole_offset, height / 2]) {
        cylinder(h = height + 1, d = hole_diameter, center = true);
    }
    translate([width - logo_hole_center_offset, length / 2, height / 2]) {
        cylinder(h = height + 1, d = hole_diameter, center = true);
    }
    
    if (!right) {
        translate([-1, wire_offset, height / 2]) {
            rotate([0, 90, 0]) {
                cylinder(h = thickness + 2, d = wire_diameter);
            }
        }
    }
}
