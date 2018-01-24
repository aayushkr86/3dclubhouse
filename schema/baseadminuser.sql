-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: May 31, 2017 at 07:35 PM
-- Server version: 5.5.42
-- PHP Version: 7.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `clubhouse`
--

-- --------------------------------------------------------

--
-- Table structure for table `adminUsers`
--

CREATE TABLE `adminUsers` (
  `pkAdminUserId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `emailId` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `type` int(11) NOT NULL DEFAULT '0',
  `createdTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `pkCategoryId` int(11) NOT NULL,
  `categoryName` varchar(500) NOT NULL,
  `categoryDesc` text,
  `categoryUnique` varchar(200) NOT NULL,
  `categoryImage` text,
  `isCategoryDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `materials`
--

CREATE TABLE `materials` (
  `pkMaterialId` int(11) NOT NULL,
  `materialName` varchar(500) NOT NULL,
  `materialDesc` text,
  `materialCreatedTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `productImages`
--

CREATE TABLE `productImages` (
  `pkProductImageId` int(11) NOT NULL,
  `fkProductId` int(11) NOT NULL,
  `productImage` varchar(1000) NOT NULL,
  `productImageCreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `pkProductId` int(11) NOT NULL,
  `fkCategoryId` int(11) NOT NULL,
  `productName` varchar(1000) NOT NULL,
  `productDesc` text,
  `minHeight` int(11) DEFAULT NULL,
  `minLength` int(11) DEFAULT NULL,
  `minBreadth` int(11) DEFAULT NULL,
  `minPrice` int(11) DEFAULT NULL,
  `isProductBlocked` tinyint(1) NOT NULL DEFAULT '0',
  `productCreatedTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `productVariants`
--

CREATE TABLE `productVariants` (
  `pkProductVariantId` int(11) NOT NULL,
  `fkProductId` int(11) NOT NULL,
  `fkMaterialId` int(11) DEFAULT NULL,
  `productLength` int(11) NOT NULL,
  `productBreadth` int(11) NOT NULL,
  `productHeight` int(11) NOT NULL,
  `productVolume` float NOT NULL,
  `productColor` varchar(500) DEFAULT NULL,
  `productColorImage` varchar(1000) DEFAULT NULL,
  `productQuality` float DEFAULT NULL,
  `productCost` float NOT NULL,
  `productStock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adminUsers`
--
ALTER TABLE `adminUsers`
  ADD PRIMARY KEY (`pkAdminUserId`),
  ADD UNIQUE KEY `emailId` (`emailId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`pkCategoryId`);

--
-- Indexes for table `materials`
--
ALTER TABLE `materials`
  ADD PRIMARY KEY (`pkMaterialId`);

--
-- Indexes for table `productImages`
--
ALTER TABLE `productImages`
  ADD PRIMARY KEY (`pkProductImageId`),
  ADD KEY `fkProductId` (`fkProductId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`pkProductId`),
  ADD KEY `fkCategoryId` (`fkCategoryId`);

--
-- Indexes for table `productVariants`
--
ALTER TABLE `productVariants`
  ADD PRIMARY KEY (`pkProductVariantId`),
  ADD KEY `fkMaterialId` (`fkMaterialId`),
  ADD KEY `fkProductId` (`fkProductId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adminUsers`
--
ALTER TABLE `adminUsers`
  MODIFY `pkAdminUserId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `pkCategoryId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `materials`
--
ALTER TABLE `materials`
  MODIFY `pkMaterialId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `productImages`
--
ALTER TABLE `productImages`
  MODIFY `pkProductImageId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `pkProductId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `productVariants`
--
ALTER TABLE `productVariants`
  MODIFY `pkProductVariantId` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `productImages`
--
ALTER TABLE `productImages`
  ADD CONSTRAINT `product_image_fk` FOREIGN KEY (`fkProductId`) REFERENCES `products` (`pkProductId`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`fkCategoryId`) REFERENCES `categories` (`pkCategoryId`);

--
-- Constraints for table `productVariants`
--
ALTER TABLE `productVariants`
  ADD CONSTRAINT `product_material_fk` FOREIGN KEY (`fkMaterialId`) REFERENCES `materials` (`pkMaterialId`),
  ADD CONSTRAINT `product_varient_fk` FOREIGN KEY (`fkProductId`) REFERENCES `products` (`pkProductId`);
