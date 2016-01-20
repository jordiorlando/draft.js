doc = draft('my_document')
group = doc.group()

rect = group.rect(200, 150)
circle = group.circle(50)

view = group.view(600, 400)

body = document.getElementById('body')
body.appendChild(view.svg())
