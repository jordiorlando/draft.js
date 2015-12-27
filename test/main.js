var doc = Draft('canvas');

var page1 = doc.page('test_page_1');
page1.system('polar');
page1.units('mm');

page1.origin(250, 0);
page1.size(500, 200);

var rect1 = page1.rect(100, 120);
var circle1 = page1.circle(50);

var page2 = doc.page('test_page_2');
page2.size(215.9, 279.4);

doc.dom.appendChild(page1.createTree());
doc.dom.appendChild(page2.createTree());

// page1.prop('name', 'reallyreallyreally_long_name_for_page1_that_just_keeps_going_on_and_on_and_on_and_oh_my_god_its_still_going');
