import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ReactWebComponent } from 'create-react-web-component';
import { componentAttributes, componentProperties } from './componentProperties';


//import Input from '@material-ui/core/Input';

class Popup extends React.Component {
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h1>{this.props.text}</h1>
        <button onClick={this.props.closePopup}>close me</button>
        </div>
      </div>
    );
  }
}

var tablas_orig = [
  {f1:3, f2:4, result:12 },
  {f1:3, f2:6, result:18 },
  {f1:3, f2:7, result:21 },
  {f1:3, f2:8, result:24 },
  {f1:3, f2:9, result:27 },

  {f1:4, f2:6, result:24 },
  {f1:4, f2:7, result:28 },
  {f1:4, f2:8, result:32 },
  {f1:4, f2:9, result:36 },
  {f1:6, f2:7, result:42 },
  {f1:6, f2:8, result:48 },
  {f1:6, f2:9, result:54 },

  {f1:7, f2:7, result:49 },
  {f1:7, f2:8, result:56 },
  {f1:7, f2:9, result:63 },

  {f1:8, f2:8, result:64 },
  {f1:8, f2:9, result:72 }
];

var tablas = [];

function filtrarTablas(tablaDe)
{
  console.log("Filtro tabla : " + tablaDe);

  tablas = [];
  for (var i = 0 ; i < tablas_orig.length ; i ++)
  {
    if (tablas_orig[i].f1 === tablaDe)
    {
      tablas.push(tablas_orig[i]);
      console.log(JSON.stringify(tablas_orig[i]));
    }
  }
}

function compare( a, b ) {
  if ( a.orden < b.orden ){
    return -1;
  }
  if ( a.orden > b.orden ){
    return 1;
  }
  return 0;
}


class Pregunta extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        pregunta: "",
        respuesta: "",
        showPopup: false,
        textPopup: "Correcto !!!",
        opciones: [],
        sabeTodo: false,
        tablaDe: props.tablaDe,
        reintentos: 0
      };
      this.posicion = 0;
    };
  incializarTabla()
  {
    for (var i = 0 ; i < tablas.length ; i++)
      tablas[i].orden = Math.random();

    tablas.sort( compare );
    
  }

  avanzarPregunta()
  {
    var pos_ini = this.posicion;
    this.posicion ++;
    if ( this.posicion >= tablas.length )
      this.posicion = 0;

    var that = this;
    while (tablas[this.posicion].aprendido)
    {
      if ( this.posicion === pos_ini )
      {
        this.setState({sabeTodo: true });

        that.setState({textPopup: "Listo, Sabe Todo !!!!"})
        that.setState({showPopup: true});
        console.log("Estadísticas:")
        console.log(tablas);

        setTimeout(function () {
          that.setState({showPopup: false});
          that.generarOpciones();
          that.armarPregunta();
        } , 30000);
  

        break;
      }
      this.posicion ++;
      if ( this.posicion >= tablas.length )
        this.posicion = 0;
    }

    this.setState({reintentos: 0 });
    this.setState({opciones: [] });
  }
  armarPregunta()
  {

    var pos = this.posicion;
    this.setState({pregunta: tablas[pos].f1 + " x " + tablas[pos].f2 });
    this.setState({respuesta: "" });
    this.nameInput.focus(); 

  }
  generarOpciones(){
    var pos = this.posicion;

    var opciones = [];

    opciones[0]={};
    opciones[0].result = tablas[pos].f1 * tablas[pos].f2;
    opciones[0].orden = Math.random();

    if ( this.state.reintentos <= 1)
    {

      opciones[1]={};
      opciones[1].result = tablas[pos].f1 * tablas[pos].f2 + 1 + Math.trunc(Math.random()*2);
      opciones[1].orden = Math.random();

      opciones[2]={};
      opciones[2].result = tablas[pos].f1 * tablas[pos].f2 - 1 - Math.trunc(Math.random()*2);
      opciones[2].orden = Math.random();

      var pos_aux = (pos+1)%opciones.length;
      opciones[3]={};
      opciones[3].result = tablas[pos_aux].f1 * tablas[pos_aux].f2;
      opciones[3].orden = Math.random();

      pos_aux=Math.abs((pos-1)%opciones.length);
      opciones[4]={};
      opciones[4].result = tablas[pos_aux].f1 * tablas[pos_aux].f2;
      opciones[4].orden = Math.random();
    }

    opciones.sort( compare );
    this.setState({opciones: opciones });

  }  
  
  analizarResultado()
  {
    var that = this;
    var pos = this.posicion;
    if (this.state.respuesta === "" + tablas[pos].result)
    {
      that.setState({textPopup: "Correcto!!"})
      that.setState({showPopup: true});
      setTimeout(function () {
                that.setState({showPopup: false});
                if ( !that.state.reintentos )
                {
                  if (tablas[pos].perfecto)
                    tablas[pos].perfecto++;
                  else
                    tablas[pos].perfecto = 1;
                } else {
                  tablas[pos].perfecto = 0;
                }

                if (!tablas[pos].stats) tablas[pos].stats = {};
                tablas[pos].stats.ok = ((tablas[pos].stats.ok)? tablas[pos].stats.ok + 1 : 1);

                if (tablas[pos].perfecto >= 2 )
                  tablas[pos].aprendido = true;

                that.avanzarPregunta();
                that.armarPregunta();
            } , 1000);
    } else {
      that.setState({textPopup: "No corecto"})
      that.setState({showPopup: true});
      setTimeout(function () {
        that.setState({showPopup: false});
        that.setState({reintentos: that.state.reintentos + 1 });
        if (that.state.reintentos <= 1) 
        {
          if (!tablas[pos].stats) tablas[pos].stats = {};
          tablas[pos].stats.ok1 = ((tablas[pos].stats.ok1)? tablas[pos].stats.ok1 + 1 : 1);

        }
        else
        {
          if (!tablas[pos].stats) tablas[pos].stats = {};
          tablas[pos].stats.ok2 = ((tablas[pos].stats.ok2)? tablas[pos].stats.ok2 + 1 : 1);
        }
        that.generarOpciones();
        that.armarPregunta();
      } , 1000);
    }
  }

  componentDidMount() {
    this.incializarTabla();
    this.avanzarPregunta();
    this.armarPregunta();
    
  }

  inputResp(event)
  {
    if(event.key === 'Enter') {
      this.analizarResultado();
    }
  }

  render() {
    return (
      <div>
      <div className="pregunta">{this.state.pregunta} = </div>
      <input type="number"
        ref={(input) => { this.nameInput = input; }}
        className="respuesta"
        id="input_respuesta"
        value={this.state.respuesta}
        onChange={(event) => this.setState({respuesta: event.target.value})}
        onKeyDown={(event) => {if(event.key === 'Enter') {this.analizarResultado(); }}}
        //aria-describedby="component-helper-text"
      />
      <br />
      {this.state.opciones.length ?
        <div className="texto"> Opciones:
        {
          this.state.opciones.map((opc) => <li>{opc.result}</li>)
        }
        </div>
        : null
      }
      <br />
      <button 
          className="respuesta" 
          onClick={() => this.analizarResultado()}
      >
        Enviar
      </button>
      {this.state.showPopup ? 
          <Popup
            text={this.state.textPopup}
            //closePopup={this.togglePopup.bind(this)}
          />
          : null
        }
      </div>
    );
  }
}

//---------------------------------------------

class CargarTablaDe extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        tablaDe: props.tablaDe,
        textPopup: "",
        showPopup: false
      };
    };

    componentDidMount() {
      this.nameInput2.focus();
      
    }

    handleEnviar() {
      console.log("ejecuto handleEnviar()");

      // valido tabla
      var aux = parseInt(this.state.tablaDe);
      for( var i =0; i< tablas_orig.length; i++ )
        if ( tablas_orig[i].f1 === aux)
          break;

      if ( i >= tablas_orig.length)
      {
        var that = this;
        this.setState({textPopup:"No tengo esa tabla"});
        this.setState({showPopup:true});
        setTimeout(
          function() {that.setState({showPopup:false});}
          ,1000);
      }
      else
        this.props.onCambio(this.state.tablaDe);
    }

    render() {
      return (
        <div>
        {/*<div>Tabla del: {this.state.tablaDe}</div>*/}
        <div className="pregunta">Ingrese la tabla: </div>
        <input type="text"
          ref={(input) => { this.nameInput2 = input; }}
          className="respuesta"
          id="input_tablaDe"
          value={this.state.tablaDe}
          onChange={(event) => this.setState({tablaDe: event.target.value})}
          //aria-describedby="component-helper-text"
          onKeyDown={(event) => {if(event.key === 'Enter') {this.handleEnviar(this.state.tablaDe) }}}
        />
        <button 
            className="respuesta" 
            onClick={() => this.handleEnviar(this.state.tablaDe)}
        >
          Enviar
        </button>
        {this.state.showPopup ? 
            <Popup
              text={this.state.textPopup}
              //closePopup={this.togglePopup.bind(this)}
            />
            : null
          }
        </div>
      );
    }
  }
  

  
  class Game extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        modo: 1,
        tablaDe: 3
      };
      this.setearTablaDe = this.setearTablaDe.bind(this);
      filtrarTablas( this.state.tablaDe);
    };

    setearTablaDe(tablaDe)
    {
      console.log("ejecuto setearTablaDe()");
      console.log("Tabla: " + tablaDe);
      
      this.setState({ tablaDe : parseInt(tablaDe, 10) },
                        () => {filtrarTablas( this.state.tablaDe);
                          this.setState({ modo:1 });
                        }
                );
    }

    render() {
      return (
        <div className="container">
          <div className="header">
            {/*}
            <button 
                className="texto" 
                onClick={() => this.setState({modo: 1 })}
            >
              Aprender
            </button>
            */}
            <button 
                className="texto" 
                onClick={() => this.setState({modo: 0 })}
            >
              Probar
            </button>
            <button 
                className="texto" 
                onClick={() => this.setState({modo: 2 })}
            >
              Elegir Tabla
            </button>
          </div>
          <div className="wrapper clearfix">
            <div className="nav">
                <ul>
                    <li>Hola</li>
                    <li>como</li>
                    <li>andás</li>
                </ul>
            </div>
            <div className="section">
              <div className="game">
                
                {this.state.modo === 0 ?
                  <div className="game-board">
                    <Pregunta tablaDe={this.state.tablaDe} />
                  </div>
                : null
                }

                {this.state.modo === 1 ?
                  <div className="texto">
                  {
                    tablas.map((tabla) => 
                      !tabla.aprendido ? <li>{tabla.f1} x {tabla.f2} = {tabla.result}</li> : null)
                  }
                  </div>
                  : null
                }

                {this.state.modo === 2 ?
                  <div className="texto">
                    <CargarTablaDe tablaDe={this.state.tablaDe} onCambio={this.setearTablaDe} />
                    
                  </div>
                  : null
                }
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
 ReactWebComponent.setAttributes(componentAttributes);
 ReactWebComponent.setProperties(componentProperties);
 ReactWebComponent.render(Game, 'web-comp');

 /*
  class gameReact extends HTMLElement {
    connectedCallback() {
      const mountPoint = document.createElement('div');
      this.attachShadow({ mode: 'open' }).appendChild(mountPoint);
      ReactDOM.render(<Game />, mountPoint);
    }
  }
  customElements.define('game-react', gameReact);
*/
 