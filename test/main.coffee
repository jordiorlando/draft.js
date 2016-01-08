doc = Draft.doc('my_document')
page = doc.page('test_page_1').size(600, 400)

page.origin(250, 0)
page.size(500, 200)

rect = page.rect(200, 150)
circle = page.circle(50)

view = document.getElementById('view')
view.appendChild(page.svg())