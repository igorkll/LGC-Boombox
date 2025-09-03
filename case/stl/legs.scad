// yes, here I turned to chatGPT for help because I was too lazy to make this model, I made the rest of the models myself

hole_diameter = 3;

$fn=100; // сглаживание

module leg() {
    difference() {
        // Основная форма - усечённый конус
        cylinder(h=10, d1=20, d2=15);

        // Сквозное отверстие 3 мм
        translate([0,0,-1]) // немного вниз, чтобы точно пробило
            cylinder(h=12, d=hole_diameter);

        // Углубление сверху (8 мм диаметр, глубина 5 мм)
        translate([0,0,5])  // от верхней грани (высота 10)
            cylinder(h=5+6, d=8);
    }
}

leg();
