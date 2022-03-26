import React from 'react'

class Home extends React.Component {

    constructor(props){

        super(props);
        this.state = {
            items: [],
            dataIsLoaded: false,
            link: "http://localhost:8000/api/comments",
            event:null,
            buttonValue:''
        };
    }

    handleClick = (e) => {
            this.setState({
                link:"http://localhost:8000"+this.state.items['hydra:view']['hydra:next'],                
                event:e
            })        
}

async componentDidUpdate(prevProps, prevState) {

    if(prevState.link != this.state.link){
        this.handleFormSubmit(this.state.event);
    }
    return
}


    componentDidMount(){
        this.handleFormSubmit();
    }

    render(){
        const {dataIsLoaded, items} = this.state;

        if(!dataIsLoaded)
        return(
            <div><h1>Please Wait...</h1></div>
        );


        return(
            <div>
            <h1>Commentaires</h1>
            {
            items['hydra:member'].map((item) => (
                <ol key={item.id}>
                   Prénom : {item.author.username}
                   Titre : {item.title}
                </ol>
            ))
            }

            <button onClick={this.handleClick} id="button" disabled={this.state.buttonValue} >Page suivante</button>
        </div>
        )
    }


    async postFormDataAsJson({url}) {

        const fetchOptions = {
            method: "GET",
            Headers: "accept: application/json"
        };

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            if(response.status != 200){
                alert('Une erreur est survenue: '+response.text)
            }
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        return response.json();
    }    

    //---------------------------------------
    async handleFormSubmit(event = null) {
            
            if(event){
                event.preventDefault();
                this.setState({
                    buttonValue:'disabled'
                })
            }
            
            const url = this.state.link;
            try {
                const responseData = await this.postFormDataAsJson({url});

                  //mise à jour des données JSON
                  this.setState({
                    items: responseData,
                    dataIsLoaded: true
                });

            } catch (error) {
              
            }
                this.setState({
                    buttonValue:''
                });
        }  
//--------------------------------                

}

export default Home

