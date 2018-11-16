<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Core\Profile\User as User;
use Closure;

class UserController extends Controller
{

    protected $user;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    function get(Request $request, $id){
        $result = $this->user->get(array('id' => (int) $id));
        return response($result);
    }
}
