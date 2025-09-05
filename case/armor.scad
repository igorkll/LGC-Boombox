$fn = 100;

width = 185;
length = 170;
height = 1;

hole_diameter = 3;
hole_offset = 2.5;

speakerbox_width = 100;
speakerbox_length = 120;
speakerbox_height = 10;
speakerbox_thickness = 3;
speakerbox_offset = 5;
speakerbox_cellOffset = 10;
speakerbox_cellSize = 10;

screen_marginWidth = -3;
screen_marginHeight = -2;
screen_width = 121 + screen_marginWidth;
screen_height = 76 + screen_marginHeight;

logo_hole_offset = 20;
logo_hole_center_offset = 30;

module speakerbox_hole() {
    translate([speakerbox_offset + speakerbox_thickness, speakerbox_thickness + (length / 2) - (speakerbox_length / 2), -1]) {
        cube([speakerbox_width - (speakerbox_thickness * 2), speakerbox_length - (speakerbox_thickness * 2), speakerbox_height + 1 - speakerbox_thickness]);
    }
}

module grid(width, height, cell, thickness) {
    for (x=[0:cell:width])
        for (y=[0:cell:height])
            translate([x, y, -1]) cube([cell/2, cell/2, thickness+2], center=false);
}

module speakerbox_holegrid() {
    translate([speakerbox_offset + speakerbox_cellOffset, speakerbox_cellOffset + ((length / 2) - (speakerbox_length / 2)), 0]) {
        grid(speakerbox_width - (speakerbox_cellOffset * 2), speakerbox_length - (speakerbox_cellOffset * 2), speakerbox_cellSize, speakerbox_height);
    }
}

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
    
    // screen
    translate([width, length / 2, height / 2]) {
        cube([screen_width, screen_height, height + 1], center = true);
    }
    
    // speakerbox
    speakerbox_hole();
    speakerbox_holegrid();
}



difference() {
    // speakerbox
    translate([speakerbox_offset, (length / 2) - (speakerbox_length / 2), 0]) {
        cube([speakerbox_width, speakerbox_length, speakerbox_height]);
    }

    speakerbox_hole();
    speakerbox_holegrid();
}