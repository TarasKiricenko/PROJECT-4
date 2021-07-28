import React from 'react'


const FrontPagePart = () => {
  return (
    <>
      <img className="frontpageimage shadow" src="https://media-exp1.licdn.com/dms/image/C4E03AQGv1qk-N_gASQ/profile-displayphoto-shrink_200_200/0/1622059523351?e=1630540800&v=beta&t=WxtIzTxYJEaanZwMUhAlzMyfK-as-FtSUXFqLMXysoQ" alt="mypicture"/>
      <div className="commentdiv shadow">
        <p className="frontpagetext">Welcome to my General Assembly Project 4 page. Here I am using Django REST Framework to build back end and React for front end. No styling frameworks used, just pure custom CSS.</p>
        <p className="frontpagetext">My name is Taras Kiricenko and I am a Junior Full Stack Developer, who has to study more, and will never stop doing so.</p>
      </div>
      <div className="commentdiv shadow">
        <p className="frontpagetext">To find out, what I am working on at present, please, have a look at my GitHub: <span><a href="https://github.com/TarasKiricenko" target="_blank" rel="noopener noreferrer">Taras Kiricenko on Github</a></span></p>
        <p className="frontpagetext">If you wish to contact me, do so via LinkedIn: <span><a href="https://linkedin.com/in/taraskiricenko" target="_blank" rel="noopener noreferrer">Taras Kiricenko on LinkedIn</a></span></p>
      </div>
    </>
  )
}

export default FrontPagePart