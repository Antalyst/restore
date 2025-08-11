-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: inventorysystem
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Raw Materials ','RM01'),(2,'Consumable Materials','cm1');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
INSERT INTO `client` VALUES (1,'Joel'),(3,'Ryle');
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `failed_stage`
--

LOCK TABLES `failed_stage` WRITE;
/*!40000 ALTER TABLE `failed_stage` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_stage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `final_stage`
--

LOCK TABLES `final_stage` WRITE;
/*!40000 ALTER TABLE `final_stage` DISABLE KEYS */;
INSERT INTO `final_stage` VALUES (1,'001',50.00,'50','8/11/2025','','delivered',40,1,NULL),(2,'002',40.00,'0','8/11/2025','','delivered',40,0,'Ryle'),(3,'003',40.00,'0','8/11/2025','','delivered',40,0,'Joel'),(4,'004',0.00,'0','8/11/2025','','delivered',40,0,NULL),(5,'005',0.00,'0','8/11/2025','','processing',80,0,'Ryle');
/*!40000 ALTER TABLE `final_stage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `group_leader`
--

LOCK TABLES `group_leader` WRITE;
/*!40000 ALTER TABLE `group_leader` DISABLE KEYS */;
INSERT INTO `group_leader` VALUES (2,'Randy'),(3,'Andrew');
/*!40000 ALTER TABLE `group_leader` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (9,'Molasis',10,1000,'http://localhost:5000/images/image_1754354681448.jpg',300,1,11),(10,'Sacks',5,2000,'http://localhost:5000/images/image_1754358770633.jpg',499,1,13),(13,'Bilog',100,2000,'http://localhost:5000/images/image_1754359766166.jpg',390,1,11),(16,'Sugar',100,10000,NULL,300,1,11),(17,'Apog',10,100,'http://localhost:5000/images/image_1754454507379.webp',300,2,19),(18,'rsacks',20,100,'http://localhost:5000/images/image_1754459326996.jpg',49999967,1,13);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `remarks`
--

LOCK TABLES `remarks` WRITE;
/*!40000 ALTER TABLE `remarks` DISABLE KEYS */;
INSERT INTO `remarks` VALUES (21,18,'testing','8/6/2025',NULL,1001),(22,9,'test','8/10/2025',NULL,1001),(23,13,'test','8/10/2025',NULL,1001),(24,16,'test','8/10/2025',NULL,1001),(25,17,'test','8/10/2025',NULL,1001);
/*!40000 ALTER TABLE `remarks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `sack_remainder`
--

LOCK TABLES `sack_remainder` WRITE;
/*!40000 ALTER TABLE `sack_remainder` DISABLE KEYS */;
INSERT INTO `sack_remainder` VALUES ('Dark Mascuvado',40),('Light Mascuvado',10);
/*!40000 ALTER TABLE `sack_remainder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `stage_one`
--

LOCK TABLES `stage_one` WRITE;
/*!40000 ALTER TABLE `stage_one` DISABLE KEYS */;
INSERT INTO `stage_one` VALUES (1,'Ryle','Dark Mascuvado',2,10,10,10,1,10,10,'8/11/2025','001A','complete'),(2,'Ryle','Dark Mascuvado',2,10,10,10,1,10,10,'8/11/2025','001B','complete'),(3,'Ryle','Dark Mascuvado',2,10,10,10,1,10,10,'8/11/2025','001C','complete'),(4,'Ryle','Dark Mascuvado',2,10,10,10,1,10,10,'8/11/2025','001D','complete'),(5,'Joel','Dark Mascuvado',2,10,10,10,1,10,10,'8/11/2025','001E','complete'),(6,'Joel','Dark Mascuvado',2,10,10,10,1,10,10,'8/11/2025','001F','complete'),(7,'Joel','Dark Mascuvado',2,10,10,10,1,10,10,'8/11/2025','002A','complete'),(8,'Joel','Dark Mascuvado',2,10,10,10,1,10,10,'8/11/2025','002B','complete'),(9,'Ryle','Dark Mascuvado',2,10,10,10,1,10,10,'8/11/2025','002C','complete'),(10,'Ryle','Dark Mascuvado',2,10,10,10,1,10,10,'8/11/2025','002D','complete'),(11,'Ryle','Dark Mascuvado',2,10,10,10,1,10,10,'8/11/2025','002E','complete'),(12,'Ryle','Dark Mascuvado',2,10,10,10,1,10,10,'8/11/2025','002F','complete'),(13,'Joel','Light Mascuvado',2,10,10,10,1,10,10,'8/11/2025','003A','complete'),(14,'Joel','Light Mascuvado',2,10,10,10,1,10,10,'8/11/2025','003B','complete'),(15,'Joel','Light Mascuvado',2,10,10,10,1,10,10,'8/11/2025','003C','complete'),(16,'Joel','Light Mascuvado',2,10,10,10,1,10,10,'8/11/2025','003D','complete'),(17,'Joel','Light Mascuvado',2,10,10,10,1,20,20,'8/11/2025','003E','complete'),(18,'Joel','Light Mascuvado',2,10,10,10,1,20,20,'8/11/2025','003F','complete'),(19,'Joel','Light Mascuvado',2,10,10,10,1,20,20,'8/11/2025','004A','complete'),(20,'Joel','Light Mascuvado',2,10,10,10,1,20,20,'8/11/2025','004B','complete');
/*!40000 ALTER TABLE `stage_one` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `stage_two`
--

LOCK TABLES `stage_two` WRITE;
/*!40000 ALTER TABLE `stage_two` DISABLE KEYS */;
INSERT INTO `stage_two` VALUES (1,1,'Randy',0,0,0,'mixed','001A'),(2,2,'Randy',0,0,0,'mixed','001B'),(3,3,'Randy',0,0,0,'mixed','001C'),(4,4,'Randy',0,0,0,'mixed','001D'),(5,5,'Randy',0,0,0,'mixed','001E'),(6,6,'Randy',0,0,0,'mixed','001F'),(7,7,'Randy',0,0,0,'mixed','002A'),(8,8,'Randy',0,0,0,'mixed','002B'),(9,9,'Randy',0,0,0,'mixed','002C'),(10,10,'Randy',0,0,0,'mixed','002D'),(11,11,'Randy',0,0,0,'mixed','002E'),(12,12,'Randy',0,0,0,'mixed','002F'),(13,13,'Randy',0,0,0,'mixed','003A'),(14,14,'Randy',0,0,0,'mixed','003B'),(15,15,'Randy',0,0,0,'mixed','003C'),(16,16,'Randy',0,0,0,'mixed','003D'),(17,17,'Randy',0,0,0,'mixed','003E'),(18,18,'Randy',0,0,0,'mixed','003F'),(19,19,'Randy',0,0,0,'mixed','004A'),(20,20,'Randy',0,0,0,'mixed','004B');
/*!40000 ALTER TABLE `stage_two` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (11,'kg'),(12,'ton'),(13,'pcs'),(19,'cu');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1001,'admin','$2b$10$vKHTRD40dNo1eX1vR4.dFe0/SkYoXkWkuKSLtjvi3jFPjTM077IcK','Admin'),(1002,'user','$2b$10$qV50WpwmNCrxy7mtqEp/kOU2Uo6iIZdXBa4twbJOy2xqORU9H8oQy','Staff');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-11 17:44:46
