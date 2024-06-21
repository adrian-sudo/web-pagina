//Creamos el componente de la estrellas
//Definimos al componente "Rating" que exporta una función
function Rating(props) {
  const { rating, numReviews, caption } = props; //Tomamos 3 propiedades con parametro "rating", "numReviews", "caption"
  return (
    <div className="rating">
      <span>
        <i
          className={
            rating >= 1 //Si es mayor o igual a 1 mostramos...
              ? "fas fa-star" //Estrella completa
              : rating >= 0.5 //Si es mayor o igual a 0.5 mostramos...
              ? "fas fa-star-half-alt" //estrella media
              : "far fa-star" //Estrlla vacia
          }
        />
      </span>
      <span>
        <i
          className={
            rating >= 2
              ? "fas fa-star"
              : rating >= 1.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        />
      </span>
      <span>
        <i
          className={
            rating >= 3
              ? "fas fa-star"
              : rating >= 2.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        />
      </span>
      <span>
        <i
          className={
            rating >= 4
              ? "fas fa-star"
              : rating >= 3.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        />
      </span>
      <span>
        <i
          className={
            rating >= 5
              ? "fas fa-star"
              : rating >= 4.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        />
      </span>
      {/* Si se proporciona la propiedad "caption", mostramos el texto en lugar del número de reseñas.*/}
      {caption ? (
        <span>{caption}</span>
      ) : (
        <span>{" " + numReviews + " Reseñas"}</span> //Si no, se muestra el número de reseñas seguido de la palabra "Reseñas"
      )}
    </div>
  );
}
export default Rating;
