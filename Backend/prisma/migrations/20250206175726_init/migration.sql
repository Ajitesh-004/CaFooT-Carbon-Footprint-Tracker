-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "lastAnalysisDate" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transportation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "transportType" TEXT NOT NULL DEFAULT 'car',
    "emissionFactor" DOUBLE PRECISION NOT NULL,
    "emissions" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transportation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Energy" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "energyUsage" DOUBLE PRECISION NOT NULL,
    "energyType" TEXT NOT NULL DEFAULT 'grid',
    "emissionFactor" DOUBLE PRECISION NOT NULL,
    "emissions" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Energy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppliancesUsage" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "applianceType" TEXT NOT NULL,
    "usageTime" DOUBLE PRECISION NOT NULL,
    "powerRating" DOUBLE PRECISION NOT NULL,
    "emissions" DOUBLE PRECISION NOT NULL,
    "emissionFactor" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppliancesUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Waste" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "wasteType" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "emissionFactor" DOUBLE PRECISION NOT NULL,
    "emissions" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Waste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterUsage" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "waterUsage" DOUBLE PRECISION NOT NULL,
    "waterType" TEXT NOT NULL,
    "emissionFactor" DOUBLE PRECISION NOT NULL,
    "emissions" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaterUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AirTravel" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "flightDistance" DOUBLE PRECISION NOT NULL,
    "emissionFactor" DOUBLE PRECISION NOT NULL,
    "emissions" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AirTravel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TotalEmission" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "totalTransportationEmission" DOUBLE PRECISION NOT NULL,
    "totalEnergyEmission" DOUBLE PRECISION NOT NULL,
    "totalWasteEmission" DOUBLE PRECISION NOT NULL,
    "totalAppliancesEmission" DOUBLE PRECISION NOT NULL,
    "totalWaterEmission" DOUBLE PRECISION NOT NULL,
    "totalAirTravelEmission" DOUBLE PRECISION NOT NULL,
    "totalEmissions" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TotalEmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisResponse" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "range" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "overallInsights" TEXT NOT NULL,
    "overallRecommendations" TEXT NOT NULL,
    "transportationInsights" TEXT NOT NULL,
    "transportationRecommendations" TEXT NOT NULL,
    "energyInsights" TEXT NOT NULL,
    "energyRecommendations" TEXT NOT NULL,
    "wasteInsights" TEXT NOT NULL,
    "wasteRecommendations" TEXT NOT NULL,
    "appliancesInsights" TEXT NOT NULL,
    "appliancesRecommendations" TEXT NOT NULL,
    "waterInsights" TEXT NOT NULL,
    "waterRecommendations" TEXT NOT NULL,
    "airTravelInsights" TEXT NOT NULL,
    "airTravelRecommendations" TEXT NOT NULL,

    CONSTRAINT "AnalysisResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityPost" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isQuestion" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityAnswer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityComment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TotalEmission_userId_date_key" ON "TotalEmission"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisResponse_userId_date_key" ON "AnalysisResponse"("userId", "date");

-- AddForeignKey
ALTER TABLE "Transportation" ADD CONSTRAINT "Transportation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Energy" ADD CONSTRAINT "Energy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppliancesUsage" ADD CONSTRAINT "AppliancesUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waste" ADD CONSTRAINT "Waste_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaterUsage" ADD CONSTRAINT "WaterUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AirTravel" ADD CONSTRAINT "AirTravel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TotalEmission" ADD CONSTRAINT "TotalEmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisResponse" ADD CONSTRAINT "AnalysisResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityAnswer" ADD CONSTRAINT "CommunityAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityAnswer" ADD CONSTRAINT "CommunityAnswer_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CommunityPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityComment" ADD CONSTRAINT "CommunityComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityComment" ADD CONSTRAINT "CommunityComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CommunityPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
