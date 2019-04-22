<?php
/**
 * Created by PhpStorm.
 * User: ouala_eddine
 * Date: 4/22/2019
 * Time: 7:27 AM
 */
?>


<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'/>
    <title>Display a map</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no'/>
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.1/mapbox-gl.js'></script>
    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.1/mapbox-gl.css' rel='stylesheet'/>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link href='src/style.css' rel='stylesheet'/>


</head>

<body>
<div class='sidebar'>
    <div class='heading'>
        <h1>Liste des familles</h1>
    </div>
    <div id='listings' class='listings'></div>
</div>
<div id='map' class='map'></div>


<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <form action="#" method="post">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Ajout d'une nouvelle famille</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="nom">Nom*</label>
                        <input type="text" class="form-control" id="nom" name="nom" placeholder="Entrer le nom"
                               required>
                    </div>

                    <div class="form-group">
                        <label for="prenom">Prenom*</label>
                        <input type="text" class="form-control" id="prenom" name="prenom" placeholder="Entrer le prenom"
                               required>
                    </div>

                    <div class="form-group">
                        <label for="tel">Numero de telephone*</label>
                        <input type="tel" class="form-control" id="tel" name="tel"
                               placeholder="Entrer le numero de telephone" required>
                    </div>

                    <div class="form-group">
                        <label for="adresse">Adresse</label>
                        <textarea class="form-control" id="adresse" rows="3"></textarea>
                    </div>

                    <small class="form-text text-muted">* ces champs sont requis!</small>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
                    <button type="submit" class="btn btn-success">Sauvegarder</button>
                </div>
            </form>
        </div>
    </div>
</div>
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
        integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
        crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
        integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
        crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
        integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
        crossorigin="anonymous"></script>
<script src="src/main.js"></script>


</body>
</html>
