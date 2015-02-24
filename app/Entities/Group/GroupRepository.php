<?php namespace App\Entities\Group;

use App\Repositories\AbstractRepository;

class GroupRepository extends AbstractRepository {

	/**
	 * The model to execute queries on.
	 *
	 * @var \App\Entities\Group\Group $model
	 */
	protected $model;

	/**
	 * Create new repository instance.
	 *
	 * @param \App\Entities\Group\Group $model
	 */
	public function __construct(Group $model)
	{
		parent::__construct($model);
	}

}