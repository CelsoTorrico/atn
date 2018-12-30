<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Core\Service\Favorite;

use Closure;

class FavoriteController extends Controller
{

    protected $favorite;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->favorite = new Favorite($request->user());
    }

    /** Retorna todos seguidores */
    function get(){

        $response = $this->favorite->getFavorites();
        
        return response()->json($response);
    }

    /** Começar a seguir */
    function add(int $id){

        $response = $this->favorite->defineFavorite($id);
        
        return response()->json($response);
    }

}
