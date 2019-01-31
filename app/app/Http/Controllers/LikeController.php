<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Core\Service\Like;

use Closure;

class LikeController extends Controller
{

    protected $like;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->like = new Like($request->user());
    }

    /**  Adiciona / Remove Likes */
    function get(int $post_id){

        $response = $this->like->setLike($post_id);
        
        return response()->json($response);
    }

}
