-- TABLES
-- level 1
-- ingredients
drop database if exists `poster-pkl`;
create database `poster-pkl`;
use `poster-pkl`;

DROP TABLE IF EXISTS `ingredients`;
CREATE TABLE `ingredients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `poster_id` int(11) NOT NULL,
  `poster_limit` decimal(10,0) NOT NULL DEFAULT '0',
  `poster_cost` decimal(10,0) NOT NULL DEFAULT '0',
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `poster_id` (`poster_id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8;

-- level 1
-- storages

DROP TABLE IF EXISTS `storages`;
CREATE TABLE `storages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `poster_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- level 2
-- referenses storages
-- referenses ingredients
-- st2i_add
DROP TABLE IF EXISTS `st2i_add`;
CREATE TABLE `st2i_add` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `storage_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `min_left` decimal(10,3) NOT NULL DEFAULT '-1.000',
  `max_left` decimal(10,3) NOT NULL DEFAULT '-1.000',
  `cost` decimal(10,2) NOT NULL DEFAULT '-1.00',
  `amount` decimal(10,3) NOT NULL DEFAULT '-1.000',
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `sid_iid` (`storage_id`,`ingredient_id`),
  KEY `ingredient_id` (`ingredient_id`),
  CONSTRAINT `st2i_add_ibfk_1` FOREIGN KEY (`storage_id`) REFERENCES `storages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `st2i_add_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- level 1
-- suppliers
DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `poster_id` int(11) NOT NULL,
  `address_delivery_info` varchar(80) NOT NULL DEFAULT '""',
  `type_delivery_info` tinyint(4) NOT NULL DEFAULT '-1' COMMENT '-1-не доставлять; 0 - email html; 1 - email excel; 2 - viber text',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- level 2
-- referenses storages
-- shablons
DROP TABLE IF EXISTS `shablons`;
CREATE TABLE `shablons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` time NOT NULL DEFAULT '00:00:00',
  `type_days` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0: (дни недели 0..6); 1: (дни месяца 0..30)',
  `storage_id` int(11) NOT NULL,
  `name` varchar(80) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `storage_id` (`storage_id`,`name`),
  CONSTRAINT `shablons_ibfk_1` FOREIGN KEY (`storage_id`) REFERENCES `storages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- level 3
-- referenses shablons
-- referenses ingredients
-- sh2i_add
DROP TABLE IF EXISTS `sh2i_add`;
CREATE TABLE `sh2i_add` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shablon_id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `min_left` decimal(10,0) NOT NULL DEFAULT '-1',
  `max_left` decimal(10,0) NOT NULL DEFAULT '-1',
  `amount` decimal(10,0) NOT NULL DEFAULT '-1',
  `cost` decimal(10,0) NOT NULL DEFAULT '-1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `shablon_id` (`shablon_id`),
  KEY `supplier_id` (`supplier_id`),
  KEY `ingredient_id` (`ingredient_id`),
  CONSTRAINT `sh2i_add_ibfk_1` FOREIGN KEY (`shablon_id`) REFERENCES `shablons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sh2i_add_ibfk_3` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- level 3
-- referenses shablons
-- shedulers
DROP TABLE IF EXISTS `shedulers`;
CREATE TABLE `shedulers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shablon_id` int(11) NOT NULL,
  `day` tinyint(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `shablon_id` (`shablon_id`,`day`),
  CONSTRAINT `shedulers_ibfk_1` FOREIGN KEY (`shablon_id`) REFERENCES `shablons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8;

-- level 1
-- storage_orders
DROP TABLE IF EXISTS `storage_orders`;
CREATE TABLE `storage_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firm_name` varchar(80) NOT NULL DEFAULT '""',
  `supplier_id` int(11) NOT NULL,
  `supplier_poster_id` int(11) NOT NULL,
  `supplier_name` varchar(80) NOT NULL DEFAULT '''''',
  `supplier_address` varchar(80) NOT NULL DEFAULT '''''',
  `supplier_phone` varchar(20) NOT NULL,
  `supplier_type_delivery` int(11) NOT NULL DEFAULT '0',
  `supplier_address_delivery` varchar(80) NOT NULL DEFAULT '''''',
  `storage_id` int(11) NOT NULL,
  `storage_poster_id` int(11) NOT NULL,
  `storage_name` varchar(80) NOT NULL DEFAULT '''''',
  `storage_address` varchar(80) NOT NULL DEFAULT '''''',
  `shablon_id` int(11) NOT NULL DEFAULT '-1',
  `num` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `date` (`date`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- level 3
-- referenses storage_orders
-- referenses ingredients
-- orders_ingredients
DROP TABLE IF EXISTS `orders_ingredients`;
CREATE TABLE `orders_ingredients` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `ingredient_name` varchar(80) NOT NULL,
  `amount` decimal(10,3) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  UNIQUE KEY `id` (`id`),
  KEY `order_id` (`order_id`),
  KEY `ingredient_id` (`ingredient_id`),
  CONSTRAINT `orders_ingredients_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `storage_orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ingredients_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- level 2
-- referenses suppliers
-- referenses storages
-- poster_supplies
DROP TABLE IF EXISTS `poster_supplies`;
CREATE TABLE `poster_supplies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `poster_id` int(11) NOT NULL,
  `storage_id` int(11) NOT NULL,
  `poster_storage_id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `poster_supplier_id` int(11) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `storage_id` (`storage_id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `poster_supplies_ibfk_1` FOREIGN KEY (`storage_id`) REFERENCES `storages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `poster_supplies_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3509 DEFAULT CHARSET=utf8;

-- level 3
-- referenses poster_supplies
-- referenses ingredients
-- poster_supply_ingredients
DROP TABLE IF EXISTS `poster_supply_ingredients`;
CREATE TABLE `poster_supply_ingredients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supply_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `poster_ingredient_id` int(11) NOT NULL,
  `amount` decimal(10,3) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `poster_supply_id` (`supply_id`),
  KEY `ingredient_id` (`ingredient_id`),
  CONSTRAINT `poster_supply_ingredients_ibfk_1` FOREIGN KEY (`supply_id`) REFERENCES `poster_supplies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `poster_supply_ingredients_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13506 DEFAULT CHARSET=utf8;

-- VIEWERS
-- level 2
-- referenses ingredients
-- referenses storages
-- all_st2su2i_view`
DROP VIEW IF EXISTS `all_st2su2i_view`;
CREATE VIEW `all_st2su2i_view` AS 
select 
	`i`.`id` AS `iid`,
	`i`.`poster_id` AS `poster_ingredient_id`,
	`s`.`id` AS `sid`,
	`s`.`poster_id` AS `poster_storage_id` 
from (`ingredients` `i` join `storages` `s`) order by `s`.`id`,`i`.`id`;

-- level 2
-- referenses storage_orders
-- last_orders
DROP VIEW IF EXISTS `last_orders`;
CREATE VIEW `last_orders` AS 
select 
	`s`.`id` AS `id`,
	`s`.`num` AS `num`,
	`d`.`suid` AS `suid`,
	`d`.`sid` AS `sid`,
	`s`.`date` AS `date`,
	`s`.`shablon_id` AS `shid` 
from (((
	select 
		`poster-pkl`.`storage_orders`.`supplier_id` AS `suid`,
		`poster-pkl`.`storage_orders`.`storage_id` AS `sid`,
		`poster-pkl`.`storage_orders`.`shablon_id` AS `shid`,
		max(`poster-pkl`.`storage_orders`.`date`) AS `date` 
	from `poster-pkl`.`storage_orders` group by `poster-pkl`.`storage_orders`.`supplier_id`,
												`poster-pkl`.`storage_orders`.`storage_id`,
												`poster-pkl`.`storage_orders`.`shablon_id`)) `d` 
join `poster-pkl`.`storage_orders` `s` 
	on(((`s`.`storage_id` = `d`.`sid`) and (`s`.`supplier_id` = `d`.`suid`) and (`s`.`shablon_id` = `d`.`shid`) and (`s`.`date` = `d`.`date`))));

-- level 3
-- referenses storages
-- referenses last_orders
-- orders_ingredients
-- for_orders
DROP VIEW IF EXISTS `for_orders`;
CREATE VIEW `for_orders` AS 
select 
	`s2su`.`suid` AS `suid`,
	`s2su`.`sid` AS `sid`,
	`s2su`.`supplier_poster_id` AS `supplier_poster_id`,
	`s2su`.`storage_poster_id` AS `storage_poster_id`,
	ifnull(`o`.`num`,0) AS `num`,
	ifnull(`o`.`date`,now()) AS `date`,
	ifnull(`i`.`count`,0) AS `count`,
	ifnull(`i`.`summ`,0) AS `summ` 
from ((((
	select 
		`s`.`id` AS `sid`,
		`s`.`poster_id` AS `storage_poster_id`,
		`su`.`id` AS `suid`,
		`su`.`poster_id` AS `supplier_poster_id` 
	from (`poster-pkl`.`storages` `s` join `poster-pkl`.`suppliers` `su`))) `s2su` 
left join `poster-pkl`.`last_orders` `o` 
	on(((`o`.`suid` = `s2su`.`suid`) and (`o`.`sid` = `s2su`.`sid`)))) 
left join (
	select 
		`poster-pkl`.`orders_ingredients`.`order_id` AS `order_id`,
		sum((case when isnull(`poster-pkl`.`orders_ingredients`.`cost`) then 0 else (`poster-pkl`.`orders_ingredients`.`cost` * `poster-pkl`.`orders_ingredients`.`amount`) end)) AS `summ`,
		sum((case when isnull(`poster-pkl`.`orders_ingredients`.`cost`) then 0 else 1 end)) AS `count` 
	from `poster-pkl`.`orders_ingredients` group by `poster-pkl`.`orders_ingredients`.`order_id`) `i` 
	on((`o`.`id` = ifnull(`i`.`order_id`,-(1)))));

-- level 2
-- referenses storages
-- referenses shablons
-- referenses shedulers
-- for_shablons
DROP VIEW IF EXISTS `for_shablons`;
CREATE VIEW `for_shablons` AS 
select 
	`s`.`id` AS `storage_id`,
	ifnull(`sh`.`id`,-(1)) AS `id`,
	ifnull(`sh`.`name`,'') AS `name`,
	ifnull(`sh`.`active`,0 ) AS `active`,
	ifnull(`sh`.`time`,cast('00:00:00' as time)) AS `time`,
	ifnull(`sh`.`type_days`,0) AS `type`,
	ifnull(`shs`.`day`,-(1)) AS `day` 
from ((`storages` `s` left join `shablons` `sh` on((`s`.`id` = `sh`.`storage_id`))) left join `shedulers` `shs` on((`sh`.`id` = `shs`.`shablon_id`)));

-- level 2
-- referenses shablons
-- referenses sh2i_add
-- for_shablon_ingredients
DROP VIEW IF EXISTS `for_shablon_ingredients`;
CREATE VIEW `for_shablon_ingredients` AS 
select distinct 
	`sh`.`id` AS `shid`,
	`sh`.`storage_id` AS `sid`,
	`sh2i`.`supplier_id` AS `suid`,
	`sh2i`.`ingredient_id` AS `iid`,
	`sh`.`name` AS `sh_name`,
	`sh`.`active` AS `active`,
	`sh2i`.`min_left` AS `min_left`,
	`sh2i`.`max_left` AS `max_left`,
	`sh2i`.`amount` AS `amount`,
	`sh2i`.`cost` AS `cost` 
from (`shablons` `sh` join `sh2i_add` `sh2i` on((`sh`.`id` = `sh2i`.`shablon_id`)));

-- level 2
-- referenses poster_supplies
-- referenses poster_supply_ingredients
-- supply_ingredients_view
DROP VIEW IF EXISTS `supply_ingredients_view`;
CREATE VIEW `supply_ingredients_view` AS 
select 
	`s`.`id` AS `supply_id`,
	`s`.`date` AS `date`,
	`s`.`supplier_id` AS `suid`,
	`s`.`storage_id` AS `sid`,
	`s`.`poster_supplier_id` AS `poster_supplier_id`,
	`i`.`ingredient_id` AS `iid`,
	`i`.`amount` AS `amount`,
	`i`.`cost` AS `cost` 
from (`poster_supplies` `s` 
join `poster_supply_ingredients` `i` 
	on((`s`.`id` = `i`.`supply_id`))) 
order by `s`.`storage_id`,`s`.`supplier_id`,`s`.`date` desc;

-- level 3
-- referenses supply_ingredients_view
-- last_cost_ingredients
DROP VIEW IF EXISTS `last_cost_ingredients`;
CREATE VIEW `last_cost_ingredients` AS 
select 
	`v`.`supply_id` AS `supply_id`,
	`v`.`date` AS `date`,
	`v`.`sid` AS `sid`,
	`v`.`suid` AS `suid`,
	`v`.`poster_supplier_id` AS `poster_supplier_id`,
	`v`.`iid` AS `iid`,
	`v`.`amount` AS `amount`,
	`v`.`cost` AS `cost` 
from (`poster-pkl`.`supply_ingredients_view` `v` 
join (
	select 
		`v`.`sid` AS `sid`,
		`v`.`iid` AS `iid`,
		max(`v`.`date`) AS `DATE` 
	from `poster-pkl`.`supply_ingredients_view` `v` group by `v`.`sid`,`v`.`iid`) `mv` 
on(((`v`.`date` = `mv`.`DATE`) and (`v`.`iid` = `mv`.`iid`) and (`v`.`sid` = `mv`.`sid`))));

-- level 4
-- referenses all_st2su2i_view
-- referenses last_cost_ingredients
-- referenses ingredients
-- all_last_cost_ingredients
DROP VIEW IF EXISTS `all_last_cost_ingredients`;
CREATE VIEW `all_last_cost_ingredients` AS 
select 
	`a`.`iid` AS `iid`,
	`a`.`poster_ingredient_id` AS `poster_ingredient_id`,
	`i`.`poster_limit` AS `poster_limit`,
	`a`.`sid` AS `sid`,
	`a`.`poster_storage_id` AS `poster_storage_id`,
	ifnull(`l`.`suid`,-(1)) AS `suid`,
	ifnull(`l`.`poster_supplier_id`,-(1)) AS `poster_supplier_id`,
	ifnull(`l`.`amount`,-(1)) AS `amount`,
	ifnull(`l`.`cost`,-(1)) AS `cost`,
	ifnull(`l`.`date`,cast('2000-01-01' as date)) AS `supply_date`,
	ifnull(`l`.`supply_id`,-(1)) AS `supply_id` 
from ((`poster-pkl`.`all_st2su2i_view` `a` 
join `poster-pkl`.`ingredients` `i` 
	on((`i`.`id` = `a`.`iid`))) 
left join `poster-pkl`.`last_cost_ingredients` `l` 
	on(((`a`.`iid` = `l`.`iid`) and (`a`.`sid` = `l`.`sid`))));

-- level 5
-- referenses all_last_cost_ingredients
-- referenses st2i_add
-- referenses suppliers
DROP VIEW IF EXISTS `for_storage_defaults`;
CREATE VIEW `for_storage_defaults` AS 
select 
	ifnull(`s2i`.`id`,-(1)) AS `id`,
	(case when isnull(`s2i`.`min_left`) then `si`.`poster_limit` else `s2i`.`min_left` end) AS `min_left`,
	(case when isnull(`s2i`.`min_left`) then 'poster' else 's2i' end) AS `min_left_info`,
	`si`.`poster_limit` AS `poster_min_left`,
	ifnull(`s2i`.`min_left`,-(1)) AS `s2i_min_left`,
	ifnull(`s2i`.`max_left`,-(1)) AS `max_left`,
	's2i' AS `max_left_info`,
	(case when (ifnull(`s2i`.`cost`,-(1)) < 0) then `si`.`cost` else `s2i`.`cost` end) AS `cost`,
	(case when (ifnull(`s2i`.`cost`,-(1)) < 0) then 'poster' else 's2i' end) AS `cost_info`,
	(case when (ifnull(`s2i`.`cost`,-(1)) < 0) then -(1) else `s2i`.`cost` end) AS `s2i_cost`,
	`si`.`cost` AS `poster_cost`,
	`si`.`supply_id` AS `supply_id`,
	`si`.`supply_date` AS `supply_date`,
	`si`.`iid` AS `iid`,
	`si`.`poster_ingredient_id` AS `poster_ingredient_id`,
	`si`.`sid` AS `sid`,
	`si`.`poster_storage_id` AS `poster_storage_id`,
	-(1) AS `shid`,
	'' AS `sh_name`,
	-(1) AS `active`,
	-(1) AS `sh2i_min_left`,
	-(1) AS `sh2i_max_left`,
	-(1) AS `sh2i_amount`,
	-(1) AS `sh2i_cost`,
	-(1) AS `sh2i_suid`,
	ifnull(`su`.`id`,`si`.`suid`) AS `suid`,
	ifnull(`su`.`id`,-(1)) AS `s2i_suid`,
	`si`.`suid` AS `poster_suid`,
	ifnull(`su`.`poster_id`,`si`.`poster_supplier_id`) AS `poster_supplier_id`,
	(case when (`su`.`id` is not null) then 's2i' else (case when (`si`.`suid` > 0) then 'poster' else 'unknown' end) end) AS `supplier_info`,
	ifnull(`s2i`.`amount`,-(1)) AS `amount`,
	(case when isnull(`s2i`.`amount`) then 'poster' else 's2i' end) AS `amount_info` 
from ((`poster-pkl`.`all_last_cost_ingredients` `si` 
left join `poster-pkl`.`st2i_add` `s2i` 
	on(((`s2i`.`ingredient_id` = `si`.`iid`) and (`s2i`.`storage_id` = `si`.`sid`)))) 
left join `poster-pkl`.`suppliers` `su` on((`s2i`.`supplier_id` = `su`.`id`)));

-- level 6
-- referenses for_shablon_ingredients
-- referenses suppliers
-- referenses for_storage_defaults
-- for_shablon_data
DROP VIEW IF EXISTS `for_shablon_data`;
CREATE VIEW `for_shablon_data` AS 
select 
	ifnull(`sh`.`shid`,-(1)) AS `shid`,
	ifnull(`sh`.`sh_name`,'') AS `sh_name`,
	ifnull(`sh`.`active`,-(1)) AS `active`,
	`sd`.`sid` AS `sid`,
	`sd`.`iid` AS `iid`,
	ifnull(`su`.`id`,`sd`.`suid`) AS `suid`,
	ifnull(`su`.`id`,-(1)) AS `sh2i_suid`,
	`sd`.`s2i_suid` AS `s2i_suid`,
	`sd`.`poster_suid` AS `poster_suid`,
	(case when (`su`.`id` is not null) then 'shablon' else `sd`.`supplier_info` end) AS `supplier_info`,
	ifnull(`su`.`poster_id`,`sd`.`poster_supplier_id`) AS `poster_supplier_id`,
	`sd`.`poster_storage_id` AS `poster_storage_id`,
	`sd`.`poster_ingredient_id` AS `poster_ingredient_id`,
	`sd`.`supply_id` AS `supply_id`,
	`sd`.`supply_date` AS `supply_date`,
	(case when (`sh`.`min_left` is not null) then `sh`.`min_left` else `sd`.`min_left` end) AS `min_left`,
	(case when (`sh`.`min_left` is not null) then 'shablon' else `sd`.`min_left_info` end) AS `min_left_info`,
	ifnull(`sh`.`min_left`,-(1)) AS `sh2i_min_left`,
	`sd`.`min_left` AS `s2i_min_left`,
	`sd`.`poster_min_left` AS `poster_min_left`,
	(case when (`sh`.`max_left` is not null) then `sh`.`max_left` else `sd`.`max_left` end) AS `max_left`,
	(case when (`sh`.`max_left` is not null) then 'shablon' else `sd`.`max_left_info` end) AS `max_left_info`,
	ifnull(`sh`.`max_left`,-(1)) AS `sh2i_max_left`,
	`sd`.`max_left` AS `s2i_max_left`,
	(case when (`sh`.`cost` is not null) then `sh`.`cost` else `sd`.`cost` end) AS `cost`,
	(case when (`sh`.`cost` is not null) then 'shablon' else `sd`.`cost_info` end) AS `cost_info`,
	ifnull(`sh`.`cost`,-(1)) AS `sh2i_cost`,
	`sd`.`s2i_cost` AS `s2i_cost`,
	`sd`.`poster_cost` AS `poster_cost`,
	(case when (`sh`.`amount` is not null) then `sh`.`amount` else `sd`.`amount` end) AS `amount`,
	(case when (`sh`.`amount` is not null) then 'shablon' else `sd`.`amount_info` end) AS `amount_info`,
	ifnull(`sh`.`amount`,-(1)) AS `sh2i_amount`,
	`sd`.`amount` AS `s2i_amount` 
from ((`poster-pkl`.`for_storage_defaults` `sd` 
left join `poster-pkl`.`for_shablon_ingredients` `sh` 
	on(((ifnull(`sh`.`sid`,-(1)) = `sd`.`sid`) and (ifnull(`sh`.`iid`,-(1)) = `sd`.`iid`)))) 
left join `poster-pkl`.`suppliers` `su` 
	on((`su`.`id` = `sh`.`suid`)));

-- level 2
-- referenses ingredients
-- referenses storages
-- referenses suppliers
DROP VIEW IF EXISTS `for_leftovers`;
CREATE VIEW `for_leftovers` AS 
select 
	ifnull(`s2i`.`id`,-(1)) AS `id`,
	(case when (ifnull(`s2i`.`min_left`,-(1)) = -(1)) then `si`.`poster_limit` else `s2i`.`min_left` end) AS `min_left`,
	(case when (ifnull(`s2i`.`min_left`,-(1)) = -(1)) then 'poster' else 's2i' end) AS `min_left_info`,
	`si`.`poster_limit` AS `poster_min_left`,
	ifnull(`s2i`.`min_left`,-(1)) AS `s2i_min_left`,
	ifnull(`s2i`.`max_left`,-(1)) AS `max_left`,
	's2i' AS `max_left_info`,
	(case when (ifnull(`s2i`.`cost`,-(1)) = -(1)) then `si`.`poster_cost` else `s2i`.`cost` end) AS `cost`,
	(case when (ifnull(`s2i`.`cost`,-(1)) = -(1)) then 'poster' else 's2i' end) AS `cost_info`,
	ifnull(`s2i`.`cost`,-(1)) AS `s2i_cost`,
	`si`.`poster_cost` AS `poster_cost`,
	ifnull(`s2i`.`amount`,-(1)) AS `amount`,
	's2i' AS `amount_info`,
	`si`.`iid` AS `iid`,
	`si`.`ingredient_id` AS `poster_ingredient_id`,
	`si`.`sid` AS `sid`,
	`si`.`storage_id` AS `poster_storage_id`,
	ifnull(`sp`.`id`,-(1)) AS `suid`,
	(case when (ifnull(`sp`.`id`,-(1)) = -(1)) then 'unknown' else 's2i' end) AS `suid_info` 
from ((((
	select distinct 
		`i`.`id` AS `iid`,
		`s`.`id` AS `sid`,
		`i`.`poster_id` AS `ingredient_id`,
		`s`.`poster_id` AS `storage_id`,
		`i`.`poster_limit` AS `poster_limit`,
		`i`.`poster_cost` AS `poster_cost` 
		from (`poster-pkl`.`ingredients` `i` join `poster-pkl`.`storages` `s`))) `si` 
left join `poster-pkl`.`st2i_add` `s2i` 
	on(((`s2i`.`ingredient_id` = `si`.`iid`) and (`s2i`.`storage_id` = `si`.`sid`)))) 
left join `poster-pkl`.`suppliers` `sp` 
	on((`sp`.`id` = `s2i`.`supplier_id`))) 
order by `si`.`sid`,`si`.`iid`;	

	