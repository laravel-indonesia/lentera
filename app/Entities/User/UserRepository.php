<?php namespace App\Entities\User;

use App\Repositories\AbstractRepository;

class UserRepository extends AbstractRepository {

	/**
	 * The model to execute queries on.
	 *
	 * @var \App\Entities\User\User $model
	 */
	protected $model;

	/**
	 * Create new repository instance.
	 *
	 * @param \App\Entities\User\User $model
	 */
	public function __construct(User $model)
	{
		parent::__construct($model);
	}

}