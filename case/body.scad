$fn = 100;

width = 185;
length = 170;
height = 70;

thickness = 5;

hole_diameter = 3;
hole_offset = 2.5;
hole_depth = 15;

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
    
    holes(-1);
    holes(height - hole_depth);
}