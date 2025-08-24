$fn = 100;

width = 80;
length = 20;
height = 5;

hole_diameter = 3;
logo_hole_offset = 30;

text_depth = 1;
text_string = "LGC Boombox";
font_size = 7;
font_name = "Impact";

difference() {
    cube([width, length, height]);
    
    center = width / 2;
    
    translate([center - logo_hole_offset, length / 2, height / 2]) {
        cylinder(h = height + 1, d = hole_diameter, center = true);
    }
    
    translate([center + logo_hole_offset, length / 2, height / 2]) {
        cylinder(h = height + 1, d = hole_diameter, center = true);
    }
    
    translate([center, length / 2, height - text_depth]) {
        linear_extrude(height = text_depth + 1) {
            text(text_string, size = font_size, font = font_name, valign = "center", halign = "center");
        }
    }
}