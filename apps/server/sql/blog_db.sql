/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80033 (8.0.33)
 Source Host           : localhost:3306
 Source Schema         : blog_db

 Target Server Type    : MySQL
 Target Server Version : 80033 (8.0.33)
 File Encoding         : 65001

 Date: 23/11/2023 19:21:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu`  (
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `id` int NOT NULL AUTO_INCREMENT,
  `menu_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `menu_path` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `order_num` int NULL DEFAULT NULL,
  `parent_id` int NULL DEFAULT NULL,
  `is_hidden` enum('0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  `is_keepAlive` enum('0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  `menu_uri` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `menu_icon` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_001bfff2e2512d1351d6b2486b`(`menu_name` ASC) USING BTREE,
  UNIQUE INDEX `IDX_33f8be7ce1ea8fb73bc1cc3c23`(`menu_path` ASC) USING BTREE,
  UNIQUE INDEX `IDX_2717c20706790ac1dc37133e3a`(`menu_uri` ASC) USING BTREE,
  INDEX `index_menu_name`(`menu_name` ASC) USING BTREE,
  INDEX `index_menu_path`(`menu_path` ASC) USING BTREE,
  INDEX `index_menu_uri`(`menu_uri` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 37 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES ('2023-10-30 18:29:52.740013', '2023-11-21 16:31:31.000000', 1, '首页', '/home', 1, 0, '0', '1', 'Home', 'ele-HomeFilled');
INSERT INTO `menu` VALUES ('2023-10-31 10:35:03.633052', '2023-11-21 16:30:29.000000', 2, '权限管理', '/auth', 2, 0, '0', '0', 'Auth', 'iconfont icon-auth');
INSERT INTO `menu` VALUES ('2023-10-31 10:36:13.609002', '2023-11-06 14:57:51.866285', 4, '菜单管理', '/auth/menu', 2, 2, '0', '0', 'Menu', NULL);
INSERT INTO `menu` VALUES ('2023-10-31 10:37:50.618929', '2023-11-06 14:58:00.499835', 5, '权限标识', '/auth/permission', 3, 2, '0', '0', 'Permission', NULL);
INSERT INTO `menu` VALUES ('2023-11-02 13:42:54.250371', '2023-11-21 16:30:39.000000', 6, '用户管理', '/user', 3, 0, '0', '0', 'User', 'iconfont icon-yonghuguanli1');
INSERT INTO `menu` VALUES ('2023-11-22 10:04:00.653664', '2023-11-22 10:04:37.000000', 34, '角色管理', '/auth/role', 1, 2, '0', '0', 'Role', 'iconfont icon-jiaoseguanli1');

-- ----------------------------
-- Table structure for permission
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission`  (
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `id` int NOT NULL AUTO_INCREMENT,
  `permission_name` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `resource_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `resource_method` enum('1','2','3','4','5') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `permission_code` enum('test_1','create_user','update_user','delete_user','create_role','update_role','delete_role','create_menu','update_menu','delete_menu','view_permission','create_permission','update_permission','delete_permission') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `parent_id` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_e38116c36ed93070edc6347846`(`permission_name` ASC) USING BTREE,
  UNIQUE INDEX `IDX_bbb1d0904fff8197fcc1425a22`(`permission_code` ASC) USING BTREE,
  INDEX `index_permission_name`(`permission_name` ASC) USING BTREE,
  INDEX `index_permission_code`(`permission_code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permission
-- ----------------------------
INSERT INTO `permission` VALUES ('2023-11-08 16:35:20.825850', '2023-11-21 14:08:19.000000', 1, '用户管理', '', '', NULL, NULL, 0);
INSERT INTO `permission` VALUES ('2023-11-08 16:37:38.831455', '2023-11-21 11:39:02.000000', 2, '创建用户', NULL, '/user', '2', 'create_user', 1);
INSERT INTO `permission` VALUES ('2023-11-17 17:46:01.621635', '2023-11-17 18:03:38.903723', 3, '更新用户', '', '/user/:id', '5', 'update_user', 1);
INSERT INTO `permission` VALUES ('2023-11-20 18:58:09.748767', '2023-11-20 18:58:09.748767', 5, '角色管理', '', '', NULL, NULL, 0);
INSERT INTO `permission` VALUES ('2023-11-20 19:03:36.117486', '2023-11-20 19:03:36.117486', 6, '创建角色', '', '/user', '2', 'create_role', 5);
INSERT INTO `permission` VALUES ('2023-11-20 19:06:22.416299', '2023-11-20 19:06:22.416299', 7, '更新角色', '', '/role/:id', '5', 'update_role', 5);
INSERT INTO `permission` VALUES ('2023-11-21 09:54:10.989892', '2023-11-21 13:22:59.000000', 8, '删除用户', '', '/user/:id', '4', 'delete_user', 1);
INSERT INTO `permission` VALUES ('2023-11-23 16:57:23.134216', '2023-11-23 16:57:23.134216', 20, '菜单管理', '', '', NULL, NULL, 0);
INSERT INTO `permission` VALUES ('2023-11-23 16:57:38.652395', '2023-11-23 16:57:38.652395', 21, '权限标识管理', '', '', NULL, NULL, 0);
INSERT INTO `permission` VALUES ('2023-11-23 16:59:24.263374', '2023-11-23 16:59:24.263374', 22, '删除角色', '', '/role/:id', '4', 'delete_role', 5);
INSERT INTO `permission` VALUES ('2023-11-23 17:03:27.710078', '2023-11-23 17:03:27.710078', 23, '创建菜单', '', '/menu', '2', 'create_menu', 20);
INSERT INTO `permission` VALUES ('2023-11-23 17:04:03.835649', '2023-11-23 17:04:03.835649', 24, '更新菜单', '', '/menu/:id', '5', 'update_menu', 20);
INSERT INTO `permission` VALUES ('2023-11-23 17:04:37.051534', '2023-11-23 17:04:37.051534', 25, '删除菜单', '', '/menu/:id', '4', 'delete_menu', 20);
INSERT INTO `permission` VALUES ('2023-11-23 17:05:13.505623', '2023-11-23 17:05:13.505623', 26, '创建权限标识', '', '/permission', '2', 'create_permission', 21);
INSERT INTO `permission` VALUES ('2023-11-23 17:05:52.392302', '2023-11-23 17:08:01.000000', 27, '更新权限标识', '', '/permission/:id', '5', 'update_permission', 21);
INSERT INTO `permission` VALUES ('2023-11-23 17:06:29.721817', '2023-11-23 17:06:29.721817', 28, '删除权限标识', '', '/permission/:id', '4', 'delete_permission', 21);
INSERT INTO `permission` VALUES ('2023-11-23 17:07:49.594274', '2023-11-23 17:07:49.594274', 29, '获取权限列表', '', '/permission', '1', 'view_permission', 21);
INSERT INTO `permission` VALUES ('2023-11-23 17:26:39.196861', '2023-11-23 17:26:39.196861', 30, 'test', '', '', NULL, NULL, 0);
INSERT INTO `permission` VALUES ('2023-11-23 17:26:57.354433', '2023-11-23 17:26:57.354433', 31, 'test1', '', '/test', '1', 'test_1', 30);

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_4810bc474fe6394c6f58cb7c9e`(`role_name` ASC) USING BTREE,
  INDEX `index_role_name`(`role_name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('2023-08-29 17:05:32.000000', '2023-11-23 17:52:27.000000', 1, 'administrator', NULL);
INSERT INTO `role` VALUES ('2023-08-29 17:05:52.000000', '2023-11-23 18:12:21.000000', 2, 'user', NULL);
INSERT INTO `role` VALUES ('2023-08-29 17:06:01.314838', '2023-09-11 16:30:21.123149', 3, 'test', NULL);
INSERT INTO `role` VALUES ('2023-11-22 14:11:59.000000', '2023-11-23 18:22:26.000000', 5, 'Common', '');
INSERT INTO `role` VALUES ('2023-11-23 10:27:13.341922', '2023-11-23 10:27:13.341922', 11, 'Chat', '');

-- ----------------------------
-- Table structure for role_menu_relation
-- ----------------------------
DROP TABLE IF EXISTS `role_menu_relation`;
CREATE TABLE `role_menu_relation`  (
  `roleId` int NOT NULL,
  `menuId` int NOT NULL,
  PRIMARY KEY (`roleId`, `menuId`) USING BTREE,
  INDEX `IDX_95c46d887acdccf42341596e37`(`roleId` ASC) USING BTREE,
  INDEX `IDX_95093fcfe9fd3ace6f4120a953`(`menuId` ASC) USING BTREE,
  CONSTRAINT `FK_95093fcfe9fd3ace6f4120a9534` FOREIGN KEY (`menuId`) REFERENCES `menu` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_95c46d887acdccf42341596e37f` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role_menu_relation
-- ----------------------------
INSERT INTO `role_menu_relation` VALUES (1, 1);
INSERT INTO `role_menu_relation` VALUES (1, 2);
INSERT INTO `role_menu_relation` VALUES (1, 4);
INSERT INTO `role_menu_relation` VALUES (1, 5);
INSERT INTO `role_menu_relation` VALUES (1, 6);
INSERT INTO `role_menu_relation` VALUES (1, 34);
INSERT INTO `role_menu_relation` VALUES (2, 1);
INSERT INTO `role_menu_relation` VALUES (5, 1);
INSERT INTO `role_menu_relation` VALUES (11, 1);

-- ----------------------------
-- Table structure for role_permission_relation
-- ----------------------------
DROP TABLE IF EXISTS `role_permission_relation`;
CREATE TABLE `role_permission_relation`  (
  `roleId` int NOT NULL,
  `permissionId` int NOT NULL,
  PRIMARY KEY (`roleId`, `permissionId`) USING BTREE,
  INDEX `IDX_e1ca88973e6058882146e25401`(`roleId` ASC) USING BTREE,
  INDEX `IDX_7822b319e3e15d982d49aa50cf`(`permissionId` ASC) USING BTREE,
  CONSTRAINT `FK_7822b319e3e15d982d49aa50cf2` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_e1ca88973e6058882146e254018` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role_permission_relation
-- ----------------------------
INSERT INTO `role_permission_relation` VALUES (1, 2);
INSERT INTO `role_permission_relation` VALUES (1, 3);
INSERT INTO `role_permission_relation` VALUES (1, 6);
INSERT INTO `role_permission_relation` VALUES (1, 7);
INSERT INTO `role_permission_relation` VALUES (1, 8);
INSERT INTO `role_permission_relation` VALUES (2, 28);
INSERT INTO `role_permission_relation` VALUES (5, 2);
INSERT INTO `role_permission_relation` VALUES (5, 3);
INSERT INTO `role_permission_relation` VALUES (5, 8);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `nick_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `user_enabled` enum('0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '1' COMMENT '0 禁用 1 启用',
  `user_avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_d34106f8ec1ebaf66f4f8609dd`(`user_name` ASC) USING BTREE,
  UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2`(`email` ASC) USING BTREE,
  UNIQUE INDEX `IDX_cc911c3d31f786d8cce41b6750`(`user_name` ASC, `email` ASC) USING BTREE,
  INDEX `index_user_name`(`user_name` ASC) USING BTREE,
  INDEX `index_email`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 46 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('2023-09-01 10:59:21.286194', '2023-09-05 10:40:43.403787', 1, 'admin', '123456', NULL, NULL, '1', NULL);
INSERT INTO `user` VALUES ('2023-09-01 10:59:30.000000', '2023-11-07 16:31:42.000000', 2, 'Peng', '123mzp', NULL, '帅逼1', '1', NULL);
INSERT INTO `user` VALUES ('2023-09-11 18:02:08.019443', '2023-09-11 18:02:08.019443', 13, 'test', '123456', '2567810155@qq.com', '张三', '0', '');
INSERT INTO `user` VALUES ('2023-09-27 17:05:23.395068', '2023-09-27 17:05:23.395068', 38, 't1145', '123456', NULL, '', '1', '');
INSERT INTO `user` VALUES ('2023-09-27 17:09:29.141554', '2023-09-27 17:09:29.141554', 40, 't11451', '123456', NULL, '', '1', '');
INSERT INTO `user` VALUES ('2023-09-27 17:14:14.498302', '2023-09-27 17:14:14.498302', 42, 'admin12', '123456', NULL, '', '1', '');
INSERT INTO `user` VALUES ('2023-09-27 17:15:21.000000', '2023-10-18 16:55:38.000000', 43, 'admin11', '123456', NULL, '', '1', '');
INSERT INTO `user` VALUES ('2023-10-18 10:23:09.000000', '2023-10-18 17:17:52.000000', 44, 'zs', '114514', NULL, '张三', '1', '');
INSERT INTO `user` VALUES ('2023-10-24 14:01:01.000000', '2023-11-23 11:16:48.000000', 45, '哈哈哈哈', '123456', NULL, '114514', '1', '');

-- ----------------------------
-- Table structure for user_role_relation
-- ----------------------------
DROP TABLE IF EXISTS `user_role_relation`;
CREATE TABLE `user_role_relation`  (
  `userId` int NOT NULL,
  `roleId` int NOT NULL,
  PRIMARY KEY (`userId`, `roleId`) USING BTREE,
  INDEX `IDX_387a09a362c32ee04b33fc4eaa`(`userId` ASC) USING BTREE,
  INDEX `IDX_bed18db98a78c46f0bcfedfe65`(`roleId` ASC) USING BTREE,
  CONSTRAINT `FK_387a09a362c32ee04b33fc4eaab` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_bed18db98a78c46f0bcfedfe652` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_role_relation
-- ----------------------------
INSERT INTO `user_role_relation` VALUES (1, 1);
INSERT INTO `user_role_relation` VALUES (1, 2);
INSERT INTO `user_role_relation` VALUES (2, 1);
INSERT INTO `user_role_relation` VALUES (2, 2);
INSERT INTO `user_role_relation` VALUES (2, 3);
INSERT INTO `user_role_relation` VALUES (13, 1);
INSERT INTO `user_role_relation` VALUES (13, 2);
INSERT INTO `user_role_relation` VALUES (38, 1);
INSERT INTO `user_role_relation` VALUES (40, 1);
INSERT INTO `user_role_relation` VALUES (42, 1);
INSERT INTO `user_role_relation` VALUES (43, 1);
INSERT INTO `user_role_relation` VALUES (43, 2);
INSERT INTO `user_role_relation` VALUES (43, 3);
INSERT INTO `user_role_relation` VALUES (44, 1);
INSERT INTO `user_role_relation` VALUES (44, 2);
INSERT INTO `user_role_relation` VALUES (44, 3);
INSERT INTO `user_role_relation` VALUES (45, 3);
INSERT INTO `user_role_relation` VALUES (45, 11);

SET FOREIGN_KEY_CHECKS = 1;
