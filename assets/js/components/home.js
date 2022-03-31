import React from 'react'

class Home extends React.Component {

    constructor(props){

        super(props);
        this.state = {
            items: [],
            dataIsLoaded: false,
            linkNext: "http://localhost:8000/api/comments",
            buttonNextValue:'',
            linkPrev: null,
            buttonPrevValue:'',
            event:null,
            server:"http://localhost:8000"
        };
    }

    handleClick = (e) => {
            this.setState({
                linkNext:this.state.server+this.state.items['hydra:view']['hydra:next'],
                linkPrev:this.state.server+this.state.items['hydra:view']['hydra:previous'],                
                event:e
            })     
}

async componentDidUpdate(prevProps, prevState) {

    if((prevState.linkNext != this.state.linkNext) || (prevState.linkPrev != this.state.linkPrev)){
        this.handleFormSubmit(this.state.event);
    }  
            //on ne desactive pas le bouton si c'est la dernière page
            if(this.state.linkNext === this.state.server+this.state.items['hydra:view']['hydra:last'])
            {
                this.setState({
                    buttonNextValue:'disabled',
                }) 
            }else{               
                this.setState({
                    buttonNextValue:'',
                });
            }
            if(this.state.linkPrev === this.state.server+this.state.items['hydra:view']['hydra:first'])
            {
                this.setState({
                    buttonPrevValue:'disabled',
                }) 
            }else{               
                this.setState({
                    buttonPrevValue:'',
                });
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
            
            <button onClick={this.handleClick} id="buttonPrev" disabled={this.state.buttonPrevValue} >Page Précédente</button>
            <button onClick={this.handleClick} id="buttonNext" disabled={this.state.buttonNextValue} >Page suivante</button>
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
            
        let url = this.state.linkNext;

            if(event){
                event.preventDefault();
                this.setState({
                    buttonNextValue:'disabled',
                    buttonPrevValue:'disabled'
                })
                //on regarde quel bouton à été cliquer next ou prev
                if(event.target.id === "buttonPrev"){
                    url = this.state.linkPrev;
                }                
            }

            try {
                const responseData = await this.postFormDataAsJson({url});

                //mise à jour des données JSON
                this.setState({
                    items: responseData,
                    dataIsLoaded: true
                });

            } catch (error) {
                alert('Une erreur est survenue : '+error);
            }                      
        }  
//--------------------------------                

}

export default Home

