$fn = 100;

width = 185;
length = 170;
height = 5;

hole_diameter = 3;
hole_offset = 2.5;

speaker_diameter = 80;
speaker_hole_diameter = 3;
speaker_hole_offset = 6;
speaker_offset = 10;

screen_width = 110.5;
screen_height = 62.2;

bracing_width = 40;
bracing_length = 10;
bracing_height = 10;

logo_hole_offset = 20;
logo_hole_center_offset = 30;

difference() {
    cube([width, length, height]);
    
    // holes
    translate([hole_offset, hole_offset, height / 2]) {
        cylinder(h = height + 1, d = hole_diameter, center = true);
    }
    translate([hole_offset, length - hole_offset, height / 2]) {
        cylinder(h = height + 1, d = hole_diameter, center = true);
    }
    
    // speaker
    speaker_x = (speaker_diameter / 2) + speaker_offset;
    speaker_y = length / 2;
    translate([speaker_x, speaker_y, height / 2]) {
        cylinder(h = height + 1, d = speaker_diameter, center = true);
    }
    
    // speaker holes
    local_speaker_hole_offset = ((speaker_diameter / 2) + speaker_hole_offset) / sqrt(2);
    translate([speaker_x + local_speaker_hole_offset, speaker_y + local_speaker_hole_offset, height / 2]) {
        cylinder(h = height + 1, d = speaker_hole_diameter, center = true);
    }
    translate([speaker_x + local_speaker_hole_offset, speaker_y - local_speaker_hole_offset, height / 2]) {
        cylinder(h = height + 1, d = speaker_hole_diameter, center = true);
    }
    translate([speaker_x - local_speaker_hole_offset, speaker_y + local_speaker_hole_offset, height / 2]) {
        cylinder(h = height + 1, d = speaker_hole_diameter, center = true);
    }
    translate([speaker_x - local_speaker_hole_offset, speaker_y - local_speaker_hole_offset, height / 2]) {
        cylinder(h = height + 1, d = speaker_hole_diameter, center = true);
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
}

module bracing(pos) {
    translate(pos) {
        cube([bracing_length, bracing_width, bracing_height], center = true);
    }
}

bracing([0, 0, height + bracing_height / 2]);