var doc = Draw('canvas');

var page1 = doc.page('test_page_1');
page1.width(500).height(200);
page1.origin(250, 0);

var rect1 = page1.rect(100, 120);
var circle1 = page1.circle(50);

var page2 = doc.page('test_page_2');
page1.width(215.9, 279.4);

doc.dom.appendChild(page1.createTree());
doc.dom.appendChild(page2.createTree());
