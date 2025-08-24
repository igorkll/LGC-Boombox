$fn = 100;

width = 185;
length = 160;
height = 5;

hole_diameter = 3;
hole_offset = 2.5;

speaker_diameter = 80;
speaker_hole_diameter = 3;
speaker_hole_offset = 4;
speaker_offset = 10;

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
}
